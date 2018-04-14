// Dom7
var $$ = Dom7;
site_url ='http://localhost/management/public/api/';
// Theme
var theme = 'auto';
if (document.location.search.indexOf('theme=') >= 0) {
  theme = document.location.search.split('theme=')[1].split('&')[0];
}

// Init App
var app = new Framework7({
  id: 'io.manage.management',
  root: '#app',
  theme: theme,
  routes: routes,
  on: {
    pageInit: initApp,
  },
  vi: {
    placementId: 'pltd4o7ibb9rc653x14',
  },
});

var mainView = app.views.create('.view-main', {
  url: '/'
});

function initApp(e){
  if(e.name=="projects"){
    app.preloader.show();
    app.request.get(site_url + 'projects', {}, function (data) {
      app.preloader.hide();

      // Template
    var template = $$('#projects-template').html();

    // compile it with Template7
    var context = {
        projects: JSON.parse(data),
        app:app
      };
    var compiledTemplate = Template7.compile(template);


    $$('.projects-content').html(compiledTemplate(context));
    //End Template

    },
    function(xhr, status){
      alert("Failed","Please check your connection and try again.",null);
      app.preloader.hide();
    });
  }
  if(e.name=="addProject"){
    app.preloader.show();
    app.request.get(site_url + 'clients', {}, function (data) {
      var clients = data;
      app.request.get(site_url + 'locations', {}, function (data) {
        app.preloader.hide();
      // Template
        var template = $$('#projects-template').html();

        // compile it with Template7
        var context = {
            clients: JSON.parse(clients),
            locations: JSON.parse(data),
            app:app
          };
        var compiledTemplate = Template7.compile(template);


        $$('.projects-content').html(compiledTemplate(context));
      },
      function(xhr, status){
        alert("Failed","Please check your connection and try again.",null);
        app.preloader.hide();
      });
    //End Template

    },
    function(xhr, status){
      alert("Failed","Please check your connection and try again.",null);
      app.preloader.hide();
    });
  }

  if(e.name=="editProject"){
    app.preloader.show();
    app.request.get(site_url + 'clients', {}, function (data) {
      var clients = data;
      app.request.get(site_url + 'locations', {}, function (data) {
        var locations = data;
        app.request.get(site_url + 'project/'+mainView.router.currentRoute.params.id, {}, function (data) {
          app.preloader.hide();
          var template = $$('#projects-template').html();

          // compile it with Template7
          var context = {
              clients: JSON.parse(clients),
              locations: JSON.parse(locations),
              project: JSON.parse(data)[0],
              app:app
            };
          var compiledTemplate = Template7.compile(template);

          project = JSON.parse(data)[0];
          $$('.projects-content').html(compiledTemplate(context));
          $('#client_id[value="'+project.client_id+'"]').prop("selected", true);
          $('#location_id[value="'+project.location_id+'"]').prop("selected", true);
        },
        function(xhr, status){
          alert("Failed","Please check your connection and try again.",null);
          app.preloader.hide();

        });


      },
      function(xhr, status){
        alert("Failed","Please check your connection and try again.",null);
        app.preloader.hide();
      });
    //End Template

    },
    function(xhr, status){
      alert("Failed","Please check your connection and try again.",null);
      app.preloader.hide();
    });
  }
}

function addProject(){
  app.preloader.show();
  app.request.post(site_url + 'project/add', {name:$('#name').val(),project_manager:$('#project_manager').val(),client_id:$('#client_id').val(),location_id:$('#location_id').val(),description:$('#description').val(),initial_fees:$('#initial_fees').val()}, function (data) {
    app.preloader.hide();
    if(data=="success"){
      app.dialog.alert("Project added successfully","Success",function(){app.router.back()});
    }
  },
  function(xhr, status){
    alert("Failed","Please check your connection and try again.",null);
    app.preloader.hide();
  });
  return false;
}

function update(){
  app.preloader.show();
  app.request.post(site_url + 'project/update', {id:$('#id').val(),name:$('#name').val(),project_manager:$('#project_manager').val(),client_id:$('#client_id').val(),location_id:$('#location_id').val(),description:$('#description').val(),initial_fees:$('#initial_fees').val()}, function (data) {
    app.preloader.hide();
    if(data=="success"){
      app.dialog.alert("Project updated successfully","Success",function(){app.router.back()});
    }
  },
  function(xhr, status){
    alert("Failed","Please check your connection and try again.",null);
    app.preloader.hide();
  });
  return false;
}

function deleteProject(id){
  app.dialog.confirm("Are you sure you want to delete project","Confirm",function(){
    app.preloader.show();
    app.request.post(site_url + 'project/delete/'+id,{}, function (data) {
      app.preloader.hide();
      if(data=="success"){
        app.dialog.alert("Project deleted successfully","Success",function(){app.router.back()});
      }
    },
    function(xhr, status){
      alert("Failed","Please check your connection and try again.",null);
      app.preloader.hide();
    });
  })
}

function editProject(id){
  mainView.router.navigate("/editProject/"+id+"/",{reloadCurrent :true})
}
