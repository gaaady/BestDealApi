# == Schema Information
#
# Table name: clicks
#
#  id         :integer          not null, primary key
#  token      :string(255)
#  ip         :string(255)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Click < ActiveRecord::Base
  attr_accessible :ip, :token
end
