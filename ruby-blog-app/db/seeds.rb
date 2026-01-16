# Create admin user
admin = User.find_or_create_by(email: 'admin@blog.com') do |user|
  user.username = 'admin'
  user.password = 'admin123'
  user.password_confirmation = 'admin123'
  user.role = 'admin'
end

# Create regular user
user = User.find_or_create_by(email: 'user@blog.com') do |u|
  u.username = 'demo_user'
  u.password = 'password123'
  u.password_confirmation = 'password123'
  u.role = 'user'
end

# Create sample posts
if Post.count == 0
  Post.create!(
    user: admin,
    title: 'Welcome to the Blog',
    content: 'This is a sample blog post created by the admin user. You can create, edit, and delete posts through the admin panel.',
    published: true
  )
  
  Post.create!(
    user: user,
    title: 'Getting Started with Rails',
    content: 'Rails is a web application framework written in Ruby. It follows the convention over configuration philosophy, making it easy to build web applications quickly.',
    published: true
  )
  
  Post.create!(
    user: admin,
    title: 'Docker and Rails',
    content: 'Docker makes it easy to containerize Rails applications. This blog is running in Docker containers with PostgreSQL, Redis, and Nginx.',
    published: true
  )
end

puts "Seeded database with admin user (admin@blog.com / admin123) and sample posts!"
