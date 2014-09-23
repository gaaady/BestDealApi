require 'test_helper'

class HotelsControllerTest < ActionController::TestCase
  setup do
    @hotel = hotels(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:hotels)
  end

  test "should create hotel" do
    assert_difference('Hotel.count') do
      post :create, hotel: { city: @hotel.city, image: @hotel.image, name: @hotel.name, price: @hotel.price }
    end

    assert_response 201
  end

  test "should show hotel" do
    get :show, id: @hotel
    assert_response :success
  end

  test "should update hotel" do
    put :update, id: @hotel, hotel: { city: @hotel.city, image: @hotel.image, name: @hotel.name, price: @hotel.price }
    assert_response 204
  end

  test "should destroy hotel" do
    assert_difference('Hotel.count', -1) do
      delete :destroy, id: @hotel
    end

    assert_response 204
  end
end
