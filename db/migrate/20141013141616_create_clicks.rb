class CreateClicks < ActiveRecord::Migration
  def change
    create_table :clicks do |t|
      t.string :token
      t.string :ip

      t.timestamps
    end
  end
end
