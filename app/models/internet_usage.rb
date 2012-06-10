class InternetUsage < ActiveRecord::Base
  belongs_to :user

  def self.high_chart(current_user,billing_period)
    h_c = LazyHighCharts::HighChart.new('graph') do |f| 
      f.options[:chart][:defaultSeriesType] = "bar" 
      f.options[:chart][:rednerTo] = "container" 
      f.options[:chart][:height] = 119
      f.options[:chart][:width] = 380
      f.options[:title][:text] = nil
      f.options[:xAxis][:categories] = ["Data"]
      f.options[:yAxis][:gridLineWidth] = 0
      f.options[:yAxis][:labels][:step] = 25
      f.options[:yAxis][:categories] = ["0"]
      f.options[:yAxis][:max] = 100
      f.series(:name=>'Internet Usage',
               :data=>[["Traffic Used",internet_usage_percentage(current_user,billing_period)]])
    end
    return h_c
  end

  def self.transactions_for(user_id,billing_period)
    where(['user_id = ? and date >= ? and date <= ?',
          user_id, billing_period.to_date.beginning_of_month.to_time,
          billing_period.to_date.end_of_month.to_time]
         ).order('date')
  end

  def self.total_usage(user_id,billing_period)
    uploaded = sum('data_uploaded',:conditions=>['user_id = ? and date >= ? and date <= ?',
      user_id,billing_period.to_date.beginning_of_month,
      billing_period.to_date.end_of_month])
    downloaded = sum('data_downloaded',:conditions=>['user_id = ? and date >= ? and date <= ?',
      user_id,billing_period.to_date.beginning_of_month,
      billing_period.to_date.end_of_month])
    return uploaded+downloaded
  end

  private
  def self.internet_usage_percentage(current_user,billing_period)
    used = InternetUsage.total_usage(current_user.id,billing_period)
    total = current_user.service.included_internet_usage
    return (((used.to_f / total.to_f)*100).round)
  end
end
