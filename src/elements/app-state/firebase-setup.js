// Initialize Firebase
//
var FB_CONFIG = {
  apiKey: "AIzaSyAhh3pxACqcPjT7stYyNYeH5NLXAUWkyao",
  authDomain: "cookbook-144005.firebaseapp.com",
  databaseURL: "https://cookbook-144005.firebaseio.com",
  projectId: "cookbook-144005",
  storageBucket: "cookbook-144005.appspot.com",
  messagingSenderId: "463542253160"
};
window.fb = firebase.initializeApp(FB_CONFIG);

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    let action = {
      type: 'SET_USER',
      user
    };
    __state__.dispatch(action);
    __state__.dispatch(__actions__.getUser(user.uid));

    document.querySelector("start-google-analytics-tracker").userId = user.uid;
  } else {
    var user = localStorage.getItem(`firebase:authUser:${FB_CONFIG.apiKey}:[DEFAULT]`);
    if(!user) return;
    try {
      user = JSON.parse(user);
    } catch(e){
      return;
    }
    firebase.auth().signInWithCustomToken(user.stsTokenManagement.refreshToken);

  }
});
