class PhoneUsage < ActiveRecord::Base
  has_one :category
  belongs_to :phone_number

  default_scope where('category_id <> 0')
  default_scope where('duration <> 0')

  def self.high_chart(phone_number,billing_period)
    auckland_usage = phone_usage_percentage(phone_number,billing_period,1)
    national_usage = phone_usage_percentage(phone_number,billing_period,2)
    mobile_usage   = phone_usage_percentage(phone_number,billing_period,3)
    china_usage    = phone_usage_percentage(phone_number,billing_period,4)
    tollfree_usage = phone_usage_percentage(phone_number,billing_period,5)
    data =[]
    data << ['Auckland', auckland_usage] unless auckland_usage.eql?(0)
    data << ['National', national_usage] unless national_usage.eql?(0)
    data << ['Mobile',   mobile_usage]   unless mobile_usage.eql?(0)
    data << ['China',    china_usage]    unless china_usage.eql?(0)
    data << ['Tollfree', tollfree_usage] unless tollfree_usage.eql?(0)

    h_c = LazyHighCharts::HighChart.new('graph') do |f| 
      f.options[:chart][:defaultSeriesType] = "pie" 
      f.options[:chart][:height] = 264
      f.options[:chart][:animation] = false
      f.options[:plotOptions] = {:series => {:animation => false}}
      f.options[:plotOptions] = {:series => {:enableMouseTracking => false}}
      f.options[:plotOptions] = {:series => {:shadow => false}}
      f.options[:chart][:width] = 380
      f.options[:title][:text] = "Phone Usage"
      f.series(:name=>'Phone Usage', :data=>data)
    end
    return h_c
  end

  def self.all_transactions_for(phone_number,billing_period)
    regxp = get_current_billing_period_regxp(billing_period)
    where(['calling_from = ? and date_and_time like ?',phone_number,regxp]
         ).group('date_and_time').order('date_and_time asc')
  end

  def self.transactions_for(phone_number,billing_period, params_page)
    regxp = get_current_billing_period_regxp(billing_period)
    where(['calling_from = ? and date_and_time like ?',phone_number,regxp]
         ).order('date_and_time asc').page params_page
  end

  def self.total_cost_by_category(phone_number,billing_period,category_id,exclude_gst=nil)
    regxp = get_current_billing_period_regxp(billing_period)
    total = sum('cost',
                :conditions=>['calling_from = ? and date_and_time like ? and category_id = ?',
                phone_number,regxp,category_id])
    return total.round(2) if exclude_gst.eql?(true)
    return (total*(1.15)).round(2)
  end

  def self.total_cost(phone_number,billing_period,exclude_gst=nil)
    regxp = get_current_billing_period_regxp(billing_period)
    total = sum('cost',
                :conditions=>['calling_from = ? and date_and_time like ?',
                phone_number,regxp])
    return total.rount(2) if exclude_gst.eql?(true)
    return (total*(1.15)).round(2)
  end

  def self.total_quantity(phone_number,billing_period,category=nil)
    regxp = get_current_billing_period_regxp(billing_period)
    if category
      sum('qty',:conditions=>['calling_from = ? and date_and_time like ? and category_id = ?',
        phone_number,regxp,category])
    else
      sum('qty',:conditions=>['calling_from = ? and date_and_time like ?',
        phone_number,regxp])
    end
  end

  def self.total_duration(phone_number,billing_period,category=nil)
    regxp = get_current_billing_period_regxp(billing_period)
    if category
      sum('duration',:conditions=>['calling_from = ? and date_and_time like ? and category_id = ?',
        phone_number,regxp,category])
    else
      sum('duration',:conditions=>['calling_from = ? and date_and_time like ?',
        phone_number,regxp])
    end
  end

  def set_cost
      t = self
      if (t.duration.to_i <= 60)
        units = 1
      elsif (t.duration.to_i % 60).eql?(0)
        units = (t.duration.to_i / 60)
      else
        units = (t.duration.to_i / 60).round + 1
      end
      t.cost = units*(0.03) if t.category_id.eql?(1)
      t.cost = units*(0.08) if t.category_id.eql?(2)
      t.cost = units*(0.18) if t.category_id.eql?(3)
      t.cost = units*(0.04) if t.category_id.eql?(4)
      t.qty = units
      t.save
  end

  private
  
  def self.import_phone_usage
    import_sql = "INSERT INTO phone_usages (date_and_time,calling_from,calling_to,duration) SELECT cdr.calldate, cdr.src, cdr.dst,billsec FROM `asteriskcdrdb`.`cdr` as cdr;"
    ActiveRecord::Base.connection.execute(import_sql)
    return true
  end

  def self.analysis_phone_call_category
    category_list = [
		['^02[0|1|2|6|7|8|9][0-9]{5,9}$',3],
		['^0086[0-9]+$',4],
		['^0800[0-9]+$',5],
		['^0508[0-9]+$',5],
		['length(calling_to) = 7',1],
		['^092[4-9][0-9]{5}$',1],
		['^093[0-9]{6}$',1],
		['^094[1|4][0-9]{5}$',1],
		['^0947[3|5|6|8][0-9]{4}$',1],
		['^0948[0-9]{5}$',1],
		['^09[5|6|8][0-9]{6}$',1],
		['^099[1|2|4|5|6|7][0-9]{5}$',1],
		['^09980[0-9]{4}$',1],
		['^0[3|4|6|7][0-9]{7}$',2],
		]
    category_list.each do |category|
      ActiveRecord::Base.connection.execute("UPDATE phone_usages SET category_id = #{category[1]} WHERE calling_to RLIKE '#{category[0]}' and category_id not in (1,2,3,4,5,6,7);")
    end
    ActiveRecord::Base.connection.execute("UPDATE phone_usages SET category_id = 1 WHERE length(calling_to) = 7 and category_id not in (1,2,3,4,5,6,7);")
    return true
  end

  def self.link_phone_number_to_user
    sql = "UPDATE phone_usages as pu left join phone_numbers as u on pu.calling_from = u.phone_number SET pu.user_id = u.user_id where pu.calling_from = u.phone_number;
"
    ActiveRecord::Base.connection.execute(sql)
    return true
  end

  def self.phone_usage_percentage(phone_number,billing_period,category_id)
    return 0 if category_id.blank?
    total_usage = PhoneUsage.total_duration(phone_number,billing_period)
    return 0 if total_usage.eql?(0)
    usage = PhoneUsage.total_duration(phone_number,billing_period,category_id)
    return (((usage.to_f / total_usage.to_f)*100).round)
  rescue => e
    logger.error("Error::phone_usage_percentage")
    logger.error(e)
    return 0
  end

  def self.get_current_billing_period_regxp(billing_period)
    regxp = billing_period.to_date.strftime("%Y-%m%")
  end

end
