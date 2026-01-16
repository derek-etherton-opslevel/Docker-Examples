module ApplicationHelper
  def simple_format(text)
    return "" if text.blank?
    text.split("\n").map { |line| "<p>#{h(line)}</p>" }.join.html_safe
  end
  
  def truncate(text, length: 100)
    return "" if text.blank?
    text.length > length ? "#{text[0...length]}..." : text
  end
end
