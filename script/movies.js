$(document).ready(function () {
    var controller = new Controller(movies["movies"]);
    //not sure why the commeneted out event listeners below aren't working like they should, the second set of listeners works for some reason
//    $("#search_button").on('click', search_movies(movies["movies"]));
//    $("#field").on('keyup', search_movies(movies["movies"]));
    $("#search_button").on('click', function(){search_movies(movies["movies"], true)});
    $("#field").on('keyup', function(){search_movies(movies["movies"], false)});
    $("body").on('click',function(){
    $("#suggestions_box").hide();
    });
});


function Controller(data) {
    this.movies = data;
    
    /*** constants ***/
    this.movies_div="#movies";
    this.grid_icon="#grid_icon";
    this.list_icon="#list_icon";
    this.combo_box="#combo_box";
    this.movie_template="#movie-template";
    this.hd_movie =".HD";
    this.rating = ".rating";

    
    
    //bind some events
    var self = this; //pass a reference to controller
    var make_grid_function=function(){
        self.make_grid.call(self);
    };
    
    var make_list_function=function(){
        self.make_list.call(self);
    };
    
    var sort_movies=function(){
        self.sort_movies.call(self);
    };
    
    $(this.grid_icon).on("click", make_grid_function);
    $(this.list_icon).on("click", make_list_function);
    $(this.combo_box).on('change',sort_movies);
    
    this.load_movies();
}

Controller.prototype.display_movie_details = function () {
    var hd = $(this.hd_movie);
    var ratings = $(this.rating);



    for (var i = 0; i < hd.length; i++) {
        if (hd[i].innerHTML == "true")
            hd[i].innerHTML = "<img id='hdMovie' src='images/HD.png'>";

        var score = ratings[i].innerHTML;
        ratings[i].innerHTML = "<span id='movie_detail'>Rating </span>";
        for (var j = 0; j < score; j++) {
            ratings[i].innerHTML += "<img id='goldStar' src='images/gold_star.png'>"
        }
        for (var j = 0; j < 5 - score; j++) {
            ratings[i].innerHTML += "<img id='regularStar' src='images/regular_star.png'>"
        }

    }

}

Controller.prototype.load_movies = function () {
    //get the template
    
    var template = $(this.movie_template).html(); //get the template
    var html_maker = new htmlMaker(template); //create an html Maker
    var html = html_maker.getHTML(this.movies); //generate dynamic HTML based on the data
    $(this.movies_div).html(html);
    
    this.display_movie_details();
};

Controller.prototype.sort_movies = function () {
    var by = $(this.combo_box).val().toLowerCase();
    this.movies = this.movies.sort(
            function (a, b) {
                if (a[by] < b[by])
                    return -1;
                if (a[by] == b[by])
                    return 0;
                if (a[by] > b[by])
                    return 1;
            }
    );

    this.load_movies();
};



Controller.prototype.make_grid = function () {
    $(this.movies_div).attr("class", "grid");
    $(this.grid_icon).attr("src", "images/grid_pressed.jpg");
    $(this.list_icon).attr("src", "images/list.jpg");
};

Controller.prototype.make_list = function () {
    $(this.movies_div).attr("class", "list");
    $(this.grid_icon).attr("src", "images/grid.jpg");
    $(this.list_icon).attr("src", "images/list_pressed.jpg");
};

function display_movie_search(){
    var movies = $(this.suggestions).html();
}

function search_movies(data, button) {
    let moviearray = data;
    var searcharray = new Array(0);
    var html = "";
    var value = $("#field").val(); //get the value of the text field
    var search_button = $("#search_button").val();
    var show = false; //don't show suggestions
    for (var i = 0; i < moviearray.length; ++i) {
        //array contains maps, need new search logic here
        var movie_details = moviearray[i].title + moviearray[i].year + moviearray[i].starring
        var start = movie_details.toLowerCase().search(value.toLowerCase().trim());

        for(let pair of moviearray){
            console.log(pair);
        }
        if (start != -1) { //if there is a search match
            html += "<div class='sub_suggestions' data-item='" + moviearray[i].title + "' >";
            
            html += moviearray[i].title.substring(0,start)+"<b>"+moviearray[i].title.substring(start,start+value.length)+"</b>"+moviearray[i].title.substring(start+value.length,moviearray[i].length)+"("+moviearray[i].year+")";
            html += "<span>, Staring "+ moviearray[i].starring+"</span>"
            html += "</div>";
            searcharray.push(moviearray[i]);
            //this.suggestions.push(moviearray[i].title);
            show = true; //show suggestions
        }

        if (show) {
            $("#suggestions_box").html(html);
            //get the children of suggestions_box with .sub_suggestions class
            //var controller = new Controller(arr);
            $("#suggestions_box").children(".sub_suggestions").on('click', function () {
                var item = $(this).attr('data-item'); //get the data
                $("#field").val(item); //show it in the field
                $("#suggestions_box").hide(); //hide the suggestion box
            });

            $("#suggestions_box").show();
        } else
            $("#suggestions_box").hide();
        
    }

    if(button == true){
    var controller = new Controller(searcharray);
    $("#suggestions_box").hide();
    }
    
    
}
