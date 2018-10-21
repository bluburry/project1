$(document).ready(function () {
    var controller = new Controller(movies["movies"]);
    //event handlers for the search button, search field and html body
    $("#search_button").on('click', function () {
        search_movies(movies["movies"], true);
    }
    );
    //when user types in search field search movies function is triggered
    $("#field").on('keyup', function () {
        search_movies(movies["movies"], false)
    });
    //when user clicks outside of the search field the suggestion box closes
    $("body").on('click', function () {
        $("#suggestions_box").hide();
    });
});

//controller for button click so the actual data can be maniupulated
function Controller(data) {
    this.movies = data;
    //initializing object
    /*** constants ***/
    this.movies_div = "#movies";
    this.grid_icon = "#grid_icon";
    this.list_icon = "#list_icon";
    this.combo_box = "#combo_box";
    this.movie_template = "#movie-template";
    this.hd_movie = ".HD";
    this.rating = ".rating";



    //bind some events
    var self = this; //pass a reference to controller
    var make_grid_function = function () {
        self.make_grid.call(self);
    };
    //make list function is called
    var make_list_function = function () {
        self.make_list.call(self);
    };
    //sort movies function is called
    var sort_movies = function () {
        self.sort_movies.call(self);
    };
    //event hanlders for grid and list icons
    $(this.grid_icon).on("click", make_grid_function);
    $(this.list_icon).on("click", make_list_function);
    $(this.combo_box).on('change', sort_movies);
    //movies are loaded
    this.load_movies();
}
//function gets details about movie
Controller.prototype.display_movie_details = function () {
    //hd movie
    var hd = $(this.hd_movie);
    //raiting
    var ratings = $(this.rating);


    //checks the inner html of each movie to see the value of hd attribute
    for (var i = 0; i < hd.length; i++) {
        if (hd[i].innerHTML == "true")
            //if true the hd logo shows up
            hd[i].innerHTML = "<img id='hdMovie' src='images/HD.png'>";
        //score is evalutd and stars are printed based on score
        var score = ratings[i].innerHTML;
        ratings[i].innerHTML = "<span id='movie_detail'>Rating </span>";
        //add gold stars
        for (var j = 0; j < score; j++) {
            ratings[i].innerHTML += "<img id='goldStar' src='images/gold_star.png'>"
        }
        //add reg stars
        for (var j = 0; j < 5 - score; j++) {
            ratings[i].innerHTML += "<img id='regularStar' src='images/regular_star.png'>"
        }

    }

}
//templates are used to load movies
Controller.prototype.load_movies = function () {
    //get the template

    var template = $(this.movie_template).html(); //get the template
    var html_maker = new htmlMaker(template); //create an html Maker
    var html = html_maker.getHTML(this.movies); //generate dynamic HTML based on the data
    $(this.movies_div).html(html);
    //movie details function is called to generate movie details
    this.display_movie_details();
};
//sort function to sort movies by rating or year
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
    //load movie function is called
    this.load_movies();
};


//function for grid view
Controller.prototype.make_grid = function () {
    $(this.movies_div).attr("class", "grid");
    //icon images changes on click
    $(this.grid_icon).attr("src", "images/grid_pressed.jpg");
    $(this.list_icon).attr("src", "images/list.jpg");
};
//list function
Controller.prototype.make_list = function () {
    $(this.movies_div).attr("class", "list");
    //image icon changes on click
    $(this.grid_icon).attr("src", "images/grid.jpg");
    $(this.list_icon).attr("src", "images/list_pressed.jpg");
};

function display_movie_search() {
    var movies = $(this.suggestions).html();
}
//search suggestion function
function search_movies(data, button) {
    let moviearray = data;
    //matched results are stored in new array
    var searcharray = new Array(0);
    var html = "";
    var value = $("#field").val(); //get the value of the text field
    var show = false; //don't show suggestions

    for (var i = 0; i < moviearray.length; ++i) {
        //movie details are loaded into string
        var movie_details = moviearray[i].title + moviearray[i].year + moviearray[i].starring
        //search function is called
        var start = movie_details.toLowerCase().search(value.toLowerCase().trim());
        if (start != -1) { //if there is a search match
            if(searcharray.length==5)
                break;
            searcharray.push(moviearray[i]);
            html += "<div class='sub_suggestions' data-item='" + moviearray[i].title + "' >";
            html += "<span class='sub_suggestions'><b>" + moviearray[i].title + "</b>" + "(" + moviearray[i].year + ")";
            html += " , Staring " + moviearray[i].starring + "</span>"
            html += "</div>";
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
    //if user removes text from search box the suggestion box disappears
    if(value == "")
            $("#suggestions_box").hide();
    //if search button is clicked all the movies stored in the search array are displayed
    if (button == true) {
        //all movies displayed if no text
        if(value == "")
            var controller = new Controller(moviearray);
        else
            var controller = new Controller(searcharray);           
        //suggestion box is hidden after 
        $("#suggestions_box").hide();
    }
}
