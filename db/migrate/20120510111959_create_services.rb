class CreateServices < ActiveRecord::Migration
  def change
    create_table :services do |t|
      t.string :name,                       :null => false, :default => ""
      t.integer :included_line,             :null => false, :default => 0
      t.integer :included_sip,              :null => false, :default => 0
      t.integer :included_internet_usage,   :null => false
      t.decimal :price_include_gst,         :null => false
      t.string  :billing_period,            :null => false, :default => "monthly"

      t.decimal :extra_interet_rate,        :null => false
      t.integer :extra_interet_unit,        :null => false, :default => 0

      t.decimal :extra_line_rate,           :null => false
      t.integer :extra_line_unit,           :null => false, :default => 0

      t.decimal :extra_sip_rate,            :null => false
      t.integer :extra_sip_unit,            :null => false, :default => 0

      t.decimal :auckland_rate,             :null => false
      t.integer :auckland_charging_unit,    :null => false, :default => 0
      t.decimal :nz_mobile_rate,            :null => false
      t.integer :nz_mobile_charging_unit,   :null => false, :default => 0
      t.decimal :nz_landline_rate,          :null => false
      t.integer :nz_landline_charging_unit, :null => false, :default => 0
      t.decimal :china_rate,                :null => false
      t.integer :china_charging_unit,       :null => false, :default => 0
      t.timestamps
    end
  end
end
