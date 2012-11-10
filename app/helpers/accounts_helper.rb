module AccountsHelper
  def account_plan_fees
    if @account.base_fee && @account.base_fee.to_i > 0
      return @account.base_fee
    end
    return @account.service.price_include_gst
  end

  def display_phone_number_in_phone_usage(phone_number,primary_phone_number = nil)
    if primary_phone_number.present?
      return "#{primary_phone_number} #{'&nbsp;'*14} Ext:#{phone_number}".html_safe
    else
      return phone_number
    end
  end

  def phone_number_selection(account)
    selection = []
      account.phone_numbers.each do |ph|
        if ph.primary_phone_number.present?
	  selection << ["#{ph.primary_phone_number} #{'&nbsp;'*10} Ext:#{ph.phone_number}".html_safe,"#{ph.phone_number}"]
        else
	  selection << ["#{ph.phone_number}","#{ph.phone_number}"]
        end
      end
    return selection
  end
end
