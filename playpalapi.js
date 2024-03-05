/**
 * Namespace for the calls that can be made to the API.
 */
const API = {
  HTTPMethods: {
    GET: "GET",
    HEAD: "HEAD",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
    CONNECT: "CONNECT",
    OPTIONS: "OPTIONS",
    TRACE: "TRACE",
    PATCH: "PATCH",
  },
  /**
   * Namespace containing utility functions to simplify some actions.
   */
  utils: {

  },
  postRequest: (URL) => {
    return fetch(URL, {
      method: API.HTTPMethods.POST
    });
  },
  getRequest: (URL) => {
    // Seems dumb, but future updates will benefit from this.
    return fetch(URL);
  }
}
/**
 * Data user for user login.
 */
class UserloginData {
  /**
   * Creates a class that contains the needed data for a login.
   * @param {string} username   name of the user
   * @param {string} password        password of the user
   */
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }
  /**
   * @returns {string} the user's name
   */
  get username() {
    return this.username;
  }
  /**
   * @returns {string} the user's password
   */
  get password() {
    return this.password;
  }
}
/**
 * Complete user data for generic actions.
 */
class FullUserData extends UserloginData {
  /**
   * Creates a class that contains all of the user's data,
   * can be incomplete for security reasons.
   * @param {string} username     user's name
   * @param {string} email        user's email
   * @param {string} password     user's password
   * @param {string} firstname    user's first name
   * @param {string} lastname     user's last name
   * @param {string} gender       user's gender
   * @param {string} biography    user's biography
   * @param {URL} personalwebsite user's personal website
   * @param {URL} pfp             user's profile picture
   * @param {string} phonenumber  user's phone number
   */
  constructor(username, email, password, firstname, lastname, gender, biography,
    personalwebsite, pfp, phonenumber) {
    super(username, password);
    this.email = email;
    this.firstname = firstname;
    this.lastname = lastname;
    this.gender = gender;
    this.biography = biography;
    this.personalwebsite = personalwebsite;
    this.pfp = pfp;
    this.phonenumber = phonenumber;
  }
  /**
   * @returns {string} user's email
   */
  get email() {
    return this.email;
  }
  /**
   * @returns {string} user's firstname
   */
  get firstname() {
    return this.firstname;
  }
  /**
   * @returns {string} user's lastname
   */
  get lastname() {
    return this.lastname;
  }
  /**
   * @returns {string} user's gender
   */
  get gender() {
    return this.gender;
  }
  /**
   * @returns {string} user's biography
   */
  get biography() {
    return this.biography;
  }
  /**
   * @returns {URL} user's personalwebsite
   */
  get personalwebsite() {
    return this.personalwebsite;
  }
  /**
   * @returns {URL} user's profile picture
   */
  get pfp() {
    return this.pfp;
  }
  /**
   * @returns {string} user's phone number
   */
  get phonenumber() {
    return this.phonenumber;
  }
}
/**
 * A social post on a community.
 */
class Post {
  /**
   * Generates a post object.
   * @param {number} postId  the ID of the post
   * @param {Date} date    creation date of the post
   * @param {string} content content of the post
   * @param {number} likes   likes of the post
   * @param {string} title   title of the post
   * @param {URL} image   image of the post
   * @param {string} name    name of the post
   * @param {FullUserData} user    author of the post
   */
  constructor(postId, date, content, likes, title, image, name, user) {
    this.postId = postId;
    this.date = date;
    this.content = content;
    this.likes = likes;
    this.title = title;
    this.image = image;
    this.name = name;
    this.user = user;
  }
  /**
   * @returns {number} the id of the post
   */
  get postId() {
    return this.postId;
  }
  /**
   * @returns {Date} the date of the post
   */
  get date() {
    return this.date;
  }
  /**
   * @returns {string} the content of the post
   */
  get content() {
    return this.content;
  }
  /**
   * @returns {number} the likes of the post
   */
  get likes() {
    return this.likes;
  }
  /**
   * @returns {string} the title of the post
   */
  get title() {
    return this.title;
  }
  /**
   * @returns {URL} the image of the post
   */
  get image() {
    return this.image;
  }
  /**
   * @returns {string} the name of the post
   */
  get name() {
    return this.name;
  }
  /**
   * @returns {FullUserData} the author of the post
   */
  get user() {
    return this.user;
  }
}
