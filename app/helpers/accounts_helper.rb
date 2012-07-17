module AccountsHelper
  def account_plan_fees
    if @account.base_fee && @account.base_fee.to_i > 0
      return @account.base_fee
    end
    return @account.service.price_include_gst
  end
end
