import {  ChangeEvent, Dispatch, FC, FormEvent, SetStateAction, useState } from "react";
import { ITrip } from "../../types/trip.types";
import { formatDate, getTomorrowDate, isTomorrowOrLater } from "../../helpers/date.helpers";
import { IBooking, IBookingList } from "../../types/booking.types";
import { IUser } from "../../types/user.types";
import Button from "../../components/common/button/button";
import Input from "../../components/common/input/input";
import Label from "../../components/common/label/label";

type Props = {
  user:null|IUser;
  bookings:IBookingList
  setBookings: Dispatch<SetStateAction<IBookingList>>
  trip: ITrip
  onClose:() => void
}

const TripPopup:FC<Props> = ({user,bookings,setBookings,trip, onClose}) => {
  const {title, duration, level} = trip

  const[guests, setGuests] = useState<number>(1)
  const [date, setDate] = useState(formatDate(getTomorrowDate().toISOString()))
  const [isNumberOfGuestsValid, setIsNumberOfGuestsValid] = useState(true)

  const validateNumberOfGuests = (guests:number) => {
    if (guests < 1) {
      setIsNumberOfGuestsValid(false)
      return
    }
    if (guests > 10){
      setIsNumberOfGuestsValid(false)
      return
    }
    setIsNumberOfGuestsValid(true)
    
  }

  const validateDate = (newDate:string) => {
    const isBefore = isTomorrowOrLater(newDate)
    if(!isBefore) {

      setDate(formatDate(getTomorrowDate().toISOString()))
      return
    }
    setDate(newDate)
  }

 const handleSetGuests = (e: ChangeEvent<HTMLInputElement>) => {
  const value = +e.target.value
  validateNumberOfGuests(value)
  setGuests(value)
 }

 const handleSetDate = (e:ChangeEvent<HTMLInputElement>) => {
  const  date = e.target.value
  validateDate(date)
 }
  

 const handleFormSubmit = (e:FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  if (user){
    const newBooking:IBooking = {
      id: self.crypto.randomUUID(),
      userId: user.id,
      tripId:trip.id,
      guests,
      date,
      trip:{
        title:trip.title,
        duration:trip.duration,
        price:trip.price
      },
      totalPrice: guests * trip.price,
      createdAt: new Date().toISOString()
    }

    setBookings([...bookings, newBooking])
    onClose()
    return
  }

  const newBooking:IBooking = {
    id: self.crypto.randomUUID(),
    userId: self.crypto.randomUUID(),
    tripId:trip.id,
    guests,
    date,
    trip:{
      title:trip.title,
      duration:trip.duration,
      price:trip.price
    },
    totalPrice: guests * trip.price,
    createdAt: new Date().toISOString()
  }
  setBookings([...bookings, newBooking])
  onClose()
 }



    return(
        <div>
        <div className="modal">
          <div data-test-id="book-trip-popup" className="book-trip-popup">
            <button
            onClick={onClose}
              data-test-id="book-trip-popup-close"
              className="book-trip-popup__close"
            >
              ×
            </button>
            <form onSubmit={handleFormSubmit} className="book-trip-popup__form" autoComplete="off">
              <div className="trip-info">
                <h3 data-test-id="book-trip-popup-title" className="trip-info__title">
                  {title}
                </h3>
                <div className="trip-info__content">
                  <img className="trip-info__calendar-img" src="/src/assets/images/calendar.svg" alt="calendar" />
                  <span
                    data-test-id="book-trip-popup-duration"
                    className="trip-info__duration"
                  >
                    <strong>{duration}</strong> days
                  </span>
                  <span
                    data-test-id="book-trip-popup-level"
                    className="trip-info__level"
                  >
                    {level}
                  </span>
                </div>
              </div>
              <Label className="input" name="Date">
              <Input
                  value={date}
                  onChange={handleSetDate}
                  testId="book-trip-popup-date"
                  name="date"
                  type="date"
                  required
                />
              </Label>
              <Label className="input" name="Number of guests" isInputError={!isNumberOfGuestsValid} errorMessage="Only from 0 to 10 guests">
              <Input
                  onChange={handleSetGuests}
                  value={`${guests}`}
                  name="quests"
                  testId="book-trip-popup-guests"
                  type="number"
                  required
                />
              </Label>
              <span className="book-trip-popup__total">
                Total:
                <output
                  data-test-id="book-trip-popup-total-value"
                  className="book-trip-popup__total-value"
                >
                  {guests * trip.price}$
                </output>
              </span>
              <Button
                testId="book-trip-popup-submit"
                type="submit"
                disabled={!isNumberOfGuestsValid}
                children={'Book a trip'}
              />
            </form>
          </div>
        </div>
      </div>
    )
}

export default TripPopup;