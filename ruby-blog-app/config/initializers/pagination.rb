# Simple pagination helper
module PaginationHelper
  def self.page(collection, page_num = 1, per_page = 10)
    page_num = page_num.to_i
    page_num = 1 if page_num < 1
    per_page = per_page.to_i
    per_page = 10 if per_page < 1
    
    offset = (page_num - 1) * per_page
    collection.limit(per_page).offset(offset)
  end
end

# Add page method to ActiveRecord::Relation
ActiveRecord::Relation.class_eval do
  def page(page_num = 1, per_page = 10)
    PaginationHelper.page(self, page_num, per_page)
  end
end
