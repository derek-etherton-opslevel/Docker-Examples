class CreatePosts < ActiveRecord::Migration[7.0]
  def change
    create_table :posts do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title, null: false
      t.text :content, null: false
      t.boolean :published, default: false
      
      t.timestamps
    end
    
    add_index :posts, :published
    add_index :posts, :created_at
  end
end
