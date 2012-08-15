namespace :billing do
  desc 'set_cost for today\'s phone call by default, add yyyy-mm for other period' 
  task :set_cost, [:period] => [:environment] do |t, args|
    option = args.period

    if option.nil?
      period = Date.today.to_s # set cost for today's phone call
    else
      period = option
    end
 
    phone_calls = PhoneUsage.where(["user_id != ? and date_and_time like ?",0,"#{period}%"])
    puts phone_calls.size
    phone_calls.each{ |pc| pc.set_cost } unless phone_calls.empty?
  end
end
