module ApplicationHelper

  # return last 12 billing months for selection drop down list
  # if user's service activation date is within 12 months preiod,
  # the selection should begin with user's service activation month
  # Notes: billing date starts from 1st of every month
  #
  def billing_period_list(service_activation_date=nil)

    start_date = Date.today.beginning_of_month
    list = []

    (0..12).each do |i|
      months_ago = start_date.months_ago(i)
      display_tag = "%B-%Y"
      list << [months_ago.strftime(display_tag) ,months_ago.to_s]

      # check user's service activation date
      unless service_activation_date.blank?
        service_activation_date = service_activation_date.to_date.beginning_of_month
        break if service_activation_date.eql?(months_ago.beginning_of_month)
      end
    end
    return list
  end

  def seconds_to_hours(time,option=nil)
    hours = time/3600.to_i
    minutes = (time/60 - hours * 60).to_i
    seconds = (time - (minutes * 60 + hours * 3600))
    
    if option && option[:format].eql?('shot') && hours.eql?(0)
      return format("%02d:%02d", minutes, seconds)
    else
      return format("%02d:%02d:%02d",hours, minutes, seconds)
    end
  end

  def category_to_location(category_id)
    Category.find(category_id).description
  rescue
    return "Unknown"
  end
end
