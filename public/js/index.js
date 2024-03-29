import '@babel/polyfill';
import { login, logout, signup } from './auth';
import { displayMap } from './mapbox';
import { addOneDocument, updateOneDocument, deleteOneDocument } from './crud';
import fillOutTheForm from './helpers/fillOutTheForm';
import { previousButtonHandler, nextButtonHandler } from './pagination';
import showLocationsFormButtonHandler from './insertLocationsForm';
import updateSettings from './updateSettings';
import { bookTour } from './stripe';
import addReview from './review';
import autoFillRelatedField from './autoFillRelatedField';

// DOM
const signupForm = document.querySelector('#signup-form');
const loginForm = document.querySelector('#login-form');
const logoutBtn = document.querySelector('#log-out-btn');

const changeTourForm = document.querySelector('#change-tour-form');
const addNewTourForm = document.querySelector('#add-new-tour-form');
const deleteTourBtn = document.querySelectorAll('#btn-delete-tour');

const changeUserForm = document.querySelector('#change-user-form');
const addNewUserForm = document.querySelector('#add-new-user-form');
const deleteUserBtn = document.querySelectorAll('#btn-delete-user');

const changeReviewForm = document.querySelector('#change-review-form');
const addNewReviewForm = document.querySelector('#add-new-review-form');
const deleteReviewBtn = document.querySelectorAll('#btn-delete-review');

const changeBookingForm = document.querySelector('#change-booking-form');
const addNewBookingForm = document.querySelector('#add-new-booking-form');
const deleteBookingBtn = document.querySelectorAll('#btn-delete-booking');

const browseBtn = document.querySelector('.browse');

const previousButton = document.querySelector('li#previous');
const nextButton = document.querySelector('li#next');
const pageSize = nextButton ? +nextButton.dataset.pageSize : undefined;

const showLocationsFormButton = document.querySelector(
  'button#totalNumberOfLocations'
);

const accountSettingsForm = document.querySelector('#account-settings-form');
const passwordChangeForm = document.querySelector('#password-change-form');

const locations = document.querySelector('#map');

const bookTourBtn = document.querySelector('#booking-tour');

const reviewForm = document.querySelector('#review-form');

const tourSelectElement = document.querySelector('select#tour');
const userSelectElement = document.querySelector('select#user');

// ACTIONS
if (bookTourBtn) {
  bookTourBtn.addEventListener('click', async (e) => {
    const { tourId } = e.target.dataset;
    await bookTour(tourId);
  });
}

// map
if (locations) displayMap(JSON.parse(locations.dataset.locations));

if (showLocationsFormButton) {
  showLocationsFormButtonHandler(showLocationsFormButton);
}

if (previousButton) {
  previousButtonHandler(previousButton, nextButton);
}

if (nextButton) {
  nextButtonHandler(previousButton, nextButton, pageSize);
}

// AUTH
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const phoneNumber = document.querySelector('#phoneNumber').value;
    const password = document.querySelector('#password').value;
    const passwordConfirm = document.querySelector('#passwordConfirm').value;
    await signup(name, email, phoneNumber, password, passwordConfirm);
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    await login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    await logout();
  });
}

// MANAGE TOURS
if (addNewTourForm) {
  addNewTourForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData();

    fillOutTheForm(
      form,
      'tours',
      'name',
      'price',
      'duration',
      'difficulty',
      'maxGroupSize',
      'summary',
      'description',
      'guides',
      'imageCover',
      'images'
    );

    await addOneDocument(form, 'tours');
  });
}

if (changeTourForm) {
  changeTourForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData();
    fillOutTheForm(
      form,
      'tours',
      'name',
      'price',
      'duration',
      'difficulty',
      'maxGroupSize',
      'summary',
      'description',
      'guides'
    );

    await updateOneDocument(
      form,
      document.querySelector('#tour-id').value,
      'tours'
    );
  });
}

if (deleteTourBtn) {
  deleteTourBtn.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      await deleteOneDocument(btn.dataset.tourid, 'tours');
    });
  });
}

// MANAGE USERS
if (addNewUserForm) {
  addNewUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData();
    fillOutTheForm(
      form,
      'users',
      'name',
      'email',
      'phoneNumber',
      'password',
      'passwordConfirm',
      'role'
    );

    await addOneDocument(form, 'users');
  });
}

if (changeUserForm) {
  changeUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData();
    if (document.querySelector('#password').value !== '') {
      fillOutTheForm(
        form,
        'users',
        'photo',
        'name',
        'email',
        'phoneNumber',
        'password',
        'role'
      );
    } else {
      fillOutTheForm(
        form,
        'users',
        'photo',
        'name',
        'email',
        'phoneNumber',
        'role'
      );
    }

    await updateOneDocument(
      form,
      document.querySelector('#user-id').value,
      'users'
    );
  });
}

if (deleteUserBtn) {
  deleteUserBtn.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      await deleteOneDocument(btn.dataset.userid, 'users');
    });
  });
}

// MANAGE REVIEWS
if (addNewReviewForm) {
  addNewReviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const tour = document.querySelector('#tour').value;
    const user = document.querySelector('#user').value;
    const review = document.querySelector('#review').value;
    const rating = document.querySelector('#rating').value;

    await addOneDocument({ tour, user, review, rating }, 'reviews');
  });
}

if (changeReviewForm) {
  changeReviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const tour = document.querySelector('#tour').value;
    const user = document.querySelector('#user').value;
    const review = document.querySelector('#review').value;
    const rating = document.querySelector('#rating').value;

    await updateOneDocument(
      { tour, user, review, rating },
      document.querySelector('#review-id').value,
      'reviews'
    );
  });
}

if (deleteReviewBtn) {
  deleteReviewBtn.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      await deleteOneDocument(btn.dataset.reviewid, 'reviews');
    });
  });
}

// MANAGE BOOKINGS
if (addNewBookingForm) {
  addNewBookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const tour = document.querySelector('#tour').value;
    const user = document.querySelector('#user').value;
    const phoneNumber = document.querySelector('#phoneNumber').value;
    const price = document.querySelector('#price').value;
    const ticketsQuantity = document.querySelector('#ticketsQuantity').value;
    const paid = document.querySelector('#paid').checked;
    const approved = document.querySelector('#approved').checked;

    await addOneDocument(
      { tour, user, phoneNumber, price, ticketsQuantity, paid, approved },
      'bookings'
    );
  });
}

if (changeBookingForm) {
  changeBookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const tour = document.querySelector('#tour').value;
    const user = document.querySelector('#user').value;
    const phoneNumber = document.querySelector('#phoneNumber').value;
    const price = document.querySelector('#price').value;
    const paid = document.querySelector('#paid').checked;
    const approved = document.querySelector('#approved').checked;

    await updateOneDocument(
      { tour, user, phoneNumber, price, ticketsQuantity, paid, approved },
      document.querySelector('#booking-id').value,
      'bookings'
    );
  });
}

if (deleteBookingBtn) {
  deleteBookingBtn.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      await deleteOneDocument(btn.dataset.bookingid, 'bookings');
    });
  });
}

// PREVIEW PHOTO
if (browseBtn) {
  // Thêm tính năng hiển thị hình sau khi chọn file xong
  browseBtn.addEventListener('click', function () {
    const file = document
      .querySelector('.browse')
      .closest('.input-group').previousSibling;
    file.click();
  });

  document
    .querySelector('input[type="file"]')
    .addEventListener('change', function (e) {
      const fileName = e.target.files[0].name;
      document.querySelector('#file').value = fileName;

      const reader = new FileReader();
      reader.onload = function (e) {
        // get loaded data and render thumbnail.
        document.getElementById('preview').src = e.target.result;
      };
      // read the image file as a data URL.
      reader.readAsDataURL(this.files[0]);
    });
}

// ACCOUNT SETTINGS
if (accountSettingsForm) {
  accountSettingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = new FormData();
    fillOutTheForm(form, 'users', 'email', 'name', 'phoneNumber', 'photo');

    await updateSettings(form, 'data');
  });
}

if (passwordChangeForm) {
  passwordChangeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('button#save-new-password').textContent =
      'UPDATING...';
    const passwordCurrent = document.getElementById('passwordCurrent').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    await updateSettings({ passwordCurrent, password, passwordConfirm });

    document.getElementById('passwordCurrent').value = '';
    document.getElementById('password').value = '';
    document.getElementById('passwordConfirm').value = '';
    document.querySelector('button#save-new-password').textContent =
      'SAVE PASSWORD';
  });
}

const alertMessage = document.getElementsByTagName('body')[0].dataset.alert;
if (alertMessage) alert(alertMessage);

if (reviewForm) {
  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = document.querySelector('#review').value;
    const rating = document.querySelector('#rating').value;
    await addReview(content, rating);
  });
}

if (tourSelectElement && userSelectElement) {
  autoFillRelatedField(tourSelectElement, userSelectElement);
}
