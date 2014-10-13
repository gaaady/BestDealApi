# == Schema Information
#
# Table name: hotels
#
#  id         :integer          not null, primary key
#  price      :integer
#  city       :string(255)
#  name       :string(255)
#  image      :string(255)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  token      :string(255)
#

class Hotel < ActiveRecord::Base

  before_create :generate_token

  attr_accessible :city, :image, :name, :price, :token

  validates_uniqueness_of :token

  protected

  def generate_token
    self.token = loop do
      random_token = SecureRandom.urlsafe_base64(nil, false)
      break random_token unless Hotel.exists?(token: random_token)
    end
  end

end
