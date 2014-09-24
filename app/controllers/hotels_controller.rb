class HotelsController < ApplicationController
  # GET /hotels
  # GET /hotels.json
  def index
    if params[:destination] == ""
      @hotels = Hotel.all
    else
      @hotels = Hotel.find_by_city(params[:destination])
    end

    render json: @hotels
  end

  # GET /hotels/1
  # GET /hotels/1.json
  def show
    @hotel = Hotel.find(params[:id])

    render json: @hotel
  end

  # POST /hotels
  # POST /hotels.json
  def create
    @hotel = Hotel.new(params[:hotel])

    if @hotel.save
      render json: @hotel, status: :created, location: @hotel
    else
      render json: @hotel.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /hotels/1
  # PATCH/PUT /hotels/1.json
  def update
    @hotel = Hotel.find(params[:id])

    if @hotel.update_attributes(params[:hotel])
      head :no_content
    else
      render json: @hotel.errors, status: :unprocessable_entity
    end
  end

  # DELETE /hotels/1
  # DELETE /hotels/1.json
  def destroy
    @hotel = Hotel.find(params[:id])
    @hotel.destroy

    head :no_content
  end
end
