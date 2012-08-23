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


#  desc 'import users from radius.rm_users table'
  task :import_users, [:reset_password] => [:environment] do |t, args|
    option = args.reset_password
    reset_password_sql = "INSERT IGNORE INTO users (email,group_id,encrypted_password)
        SELECT rad.username, rad.groupid, '$2a$10$Y074UN9keaqsTYz.8cMJGuBsAeZCjQM50yGfvOWksDdr..n6DRFci'
        FROM `radius`.`rm_users` as rad;"

    sql = "INSERT IGNORE INTO users (email,group_id,encrypted_password)
        SELECT rad.username, rad.groupid, rad.password
        FROM `radius`.`rm_users` as rad;"
    if option.nil?
    else
    end
  end
end
