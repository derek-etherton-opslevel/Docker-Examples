class Post < ApplicationRecord
  belongs_to :user
  has_many :comments, dependent: :destroy
  
  validates :title, presence: true
  validates :content, presence: true
  
  scope :published, -> { where(published: true) }
  scope :recent, -> { order(created_at: :desc) }
  
  after_create :notify_subscribers
  
  private
  
  def notify_subscribers
    # This would be handled by Sidekiq in a real application
    # PostNotificationJob.perform_async(self.id)
  end
end
