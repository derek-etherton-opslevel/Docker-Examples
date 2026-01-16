from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_redis import FlaskRedis
from datetime import datetime
import os

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    'DATABASE_URL',
    'postgresql://todo_user:todo_pass@postgres:5432/todo_db'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Redis configuration
app.config['REDIS_URL'] = os.getenv('REDIS_URL', 'redis://redis:6379/0')

db = SQLAlchemy(app)
redis_client = FlaskRedis(app)


class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    completed = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'completed': self.completed,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    try:
        # Check database connection
        db.session.execute(db.text('SELECT 1'))
        db_status = 'ok'
    except Exception:
        db_status = 'error'

    try:
        # Check Redis connection
        redis_client.ping()
        redis_status = 'ok'
    except Exception:
        redis_status = 'error'

    return jsonify({
        'status': 'healthy' if db_status == 'ok' and redis_status == 'ok' else 'degraded',
        'database': db_status,
        'redis': redis_status
    }), 200 if db_status == 'ok' and redis_status == 'ok' else 503


@app.route('/api/todos', methods=['GET'])
def get_todos():
    """Get all todos, with optional filtering"""
    completed = request.args.get('completed', type=str)
    
    # Try to get from cache first
    cache_key = f"todos:{completed or 'all'}"
    cached = redis_client.get(cache_key)
    if cached:
        import json
        return jsonify(json.loads(cached)), 200

    query = Todo.query
    if completed is not None:
        query = query.filter_by(completed=(completed.lower() == 'true'))
    
    todos = query.order_by(Todo.created_at.desc()).all()
    result = [todo.to_dict() for todo in todos]
    
    # Cache for 60 seconds
    import json
    redis_client.setex(cache_key, 60, json.dumps(result))
    
    return jsonify(result), 200


@app.route('/api/todos/<int:todo_id>', methods=['GET'])
def get_todo(todo_id):
    """Get a specific todo by ID"""
    todo = Todo.query.get_or_404(todo_id)
    return jsonify(todo.to_dict()), 200


@app.route('/api/todos', methods=['POST'])
def create_todo():
    """Create a new todo"""
    data = request.get_json()
    
    if not data or 'title' not in data:
        return jsonify({'error': 'Title is required'}), 400
    
    todo = Todo(
        title=data['title'],
        description=data.get('description', ''),
        completed=data.get('completed', False)
    )
    
    db.session.add(todo)
    db.session.commit()
    
    # Invalidate cache
    redis_client.delete('todos:all', 'todos:true', 'todos:false')
    
    return jsonify(todo.to_dict()), 201


@app.route('/api/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    """Update a specific todo"""
    todo = Todo.query.get_or_404(todo_id)
    data = request.get_json()
    
    if 'title' in data:
        todo.title = data['title']
    if 'description' in data:
        todo.description = data['description']
    if 'completed' in data:
        todo.completed = data['completed']
    
    todo.updated_at = datetime.utcnow()
    db.session.commit()
    
    # Invalidate cache
    redis_client.delete('todos:all', 'todos:true', 'todos:false')
    
    return jsonify(todo.to_dict()), 200


@app.route('/api/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    """Delete a specific todo"""
    todo = Todo.query.get_or_404(todo_id)
    db.session.delete(todo)
    db.session.commit()
    
    # Invalidate cache
    redis_client.delete('todos:all', 'todos:true', 'todos:false')
    
    return jsonify({'message': 'Todo deleted successfully'}), 200


@app.route('/api/todos/<int:todo_id>/toggle', methods=['POST'])
def toggle_todo(todo_id):
    """Toggle the completed status of a todo"""
    todo = Todo.query.get_or_404(todo_id)
    todo.completed = not todo.completed
    todo.updated_at = datetime.utcnow()
    db.session.commit()
    
    # Invalidate cache
    redis_client.delete('todos:all', 'todos:true', 'todos:false')
    
    return jsonify(todo.to_dict()), 200


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    
    app.run(host='0.0.0.0', port=5000, debug=os.getenv('FLASK_DEBUG', 'False').lower() == 'true')
