window.onload = function() {
  var login = $("#login")
  login.click(function() {
    console.log('login')
    navigator.id.request()
  })

  var logout = $("#logout")
  logout.click(function() {
    console.log('logout')
    navigator.id.logout()
  })

  navigator.id.watch({
    onlogin: function(assertion) {
      var xhr = new XMLHttpRequest()
      xhr.open("POST", "/persona/verify", true)
      xhr.setRequestHeader("Content-Type", "application/json")
      xhr.addEventListener("loadend", function(e) {
        var data = JSON.parse(this.responseText)
        if (data && data.status === "okay") {
          console.log("You have been logged in as: " + data.email)
          $('#user-dropdown').show()
          var link = $('#user-dropdown > a')
          link.text(data.email)
          link.append($('<b>').addClass('caret'))
          $('#user-login').hide()
        }
      }, false)

      xhr.send(JSON.stringify({
        assertion: assertion
      }))
    },
    onlogout: function() {
      var xhr = new XMLHttpRequest()
      xhr.open("POST", "/persona/logout", true)
      xhr.addEventListener("loadend", function(e) {
        console.log("You have been logged out")
        $('#user-dropdown').hide()
        $('#user-login').show()
      })
      xhr.send()
    }
  })
}