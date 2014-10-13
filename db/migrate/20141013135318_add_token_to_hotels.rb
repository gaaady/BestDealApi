class AddTokenToHotels < ActiveRecord::Migration
  def change
    add_column :hotels, :token, :string
    add_index :hotels, :token, :unique => true
  end
end
