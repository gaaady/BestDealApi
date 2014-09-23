class CreateHotels < ActiveRecord::Migration
  def change
    create_table :hotels do |t|
      t.integer :price
      t.string :city
      t.string :name
      t.string :image

      t.timestamps
    end
  end
end
