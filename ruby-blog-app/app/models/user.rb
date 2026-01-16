class User < ApplicationRecord
  has_secure_password
  
  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy
  
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :username, presence: true, uniqueness: true
  validates :password, length: { minimum: 6 }, if: -> { new_record? || !password.nil? }
  
  def admin?
    role == 'admin'
  end
end
