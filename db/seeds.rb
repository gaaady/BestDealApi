# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

hotels = Hotel.create([
	{name: "Grand Budapest", city: "Tel Aviv", price: 30, image: "http://www.thefloridahotelorlando.com/var/floridahotelorlando/storage/images/media/images/photo-gallery/hotel-images/florida-hotel-driveway/26955-1-eng-US/Florida-Hotel-Driveway.jpg"},
	{name: "Ritz", city: "London", price: 60, image: "http://www.college-hotel.com/client/cache/contenu/_500____college-hotelp1diapo1_718.jpg"},
	{name: "Holliday Inn", city: "London", price: 80, image: "http://camgozler.com/wp-content/uploads/2014/05/hotel-03.jpg"},
	{name: "Dan Panorama", city: "Tel Aviv", price: 40, image: "http://camgozler.com/wp-content/uploads/2014/05/hotel-03.jpg"},
	{name: "Leonardo", city: "Tel Aviv", price: 20, image: "http://camgozler.com/wp-content/uploads/2014/05/hotel-03.jpg"}
])