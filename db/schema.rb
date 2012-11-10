# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20121110181332) do

  create_table "billing_credits", :force => true do |t|
    t.integer  "user_id",                                       :null => false
    t.decimal  "amount",         :precision => 11, :scale => 2, :null => false
    t.string   "description",                                   :null => false
    t.string   "billing_period",                                :null => false
    t.datetime "created_at",                                    :null => false
    t.datetime "updated_at",                                    :null => false
  end

  create_table "categories", :force => true do |t|
    t.string   "description", :null => false
    t.string   "location",    :null => false
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "internet_usages", :force => true do |t|
    t.integer  "user_id",                        :null => false
    t.date     "date",                           :null => false
    t.integer  "data_uploaded",   :default => 0, :null => false
    t.integer  "data_downloaded", :default => 0, :null => false
    t.datetime "created_at",                     :null => false
    t.datetime "updated_at",                     :null => false
  end

  create_table "phone_numbers", :force => true do |t|
    t.integer  "user_id",              :null => false
    t.string   "phone_number",         :null => false
    t.string   "area_code",            :null => false
    t.datetime "created_at",           :null => false
    t.datetime "updated_at",           :null => false
    t.string   "primary_phone_number"
  end

  create_table "phone_usages", :force => true do |t|
    t.integer  "user_id",                                      :null => false
    t.datetime "date_and_time",                                :null => false
    t.string   "calling_from",                                 :null => false
    t.string   "calling_to",                                   :null => false
    t.integer  "duration",                                     :null => false
    t.integer  "category_id",                                  :null => false
    t.decimal  "cost",          :precision => 11, :scale => 2, :null => false
    t.integer  "qty"
    t.datetime "created_at",                                   :null => false
    t.datetime "updated_at",                                   :null => false
  end

  create_table "services", :force => true do |t|
    t.string   "name",                                             :default => "",        :null => false
    t.decimal  "price_include_gst", :precision => 11, :scale => 2,                        :null => false
    t.string   "billing_period",                                   :default => "monthly", :null => false
    t.datetime "created_at",                                                              :null => false
    t.datetime "updated_at",                                                              :null => false
  end

  create_table "users", :force => true do |t|
    t.string   "email",                                              :default => "",    :null => false
    t.string   "encrypted_password",                                 :default => "",    :null => false
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                                      :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.integer  "failed_attempts",                                    :default => 0
    t.datetime "locked_at"
    t.boolean  "is_admin",                                           :default => false, :null => false
    t.integer  "service_id",                                                            :null => false
    t.decimal  "base_fee",            :precision => 11, :scale => 2
    t.datetime "created_at",                                                            :null => false
    t.datetime "updated_at",                                                            :null => false
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true

end
