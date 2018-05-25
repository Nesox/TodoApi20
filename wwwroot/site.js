// <snippet_SiteJs>
const uri = 'api/todo';
let todos = null;
function getCount(data) {
    const el = $('#counter');
    let name = 'to-do';
    if (data) {
        if (data > 1) {
            name = 'to-dos';
        }
        el.text(data + ' ' + name);
    } else {
        el.html('No ' + name);
    }
}

$(document).ready(function () {
    $("#show-completed").change(function () {
        getData();
    });
});

$(document).ready(function () {
    getData();
});

// <snippet_GetData>
function getData() {

    $.ajax({
        type: 'GET',
        url: uri,
        success: function (data) {
            $('#todos').empty();
            getCount(data.length);

            data.sort(function (a, b) {
                 return (a.isComplete ? 1 : 0) - (b.isComplete ? 1 : 0);
            });

            var showCompleted = $("#show-completed").is(":checked");
            $.each(data, function (key, item) {
                const checked = item.isComplete ? 'checked' : '';
                
                if (item.isComplete && !showCompleted)
                    return;

                    $('<tr><td><input disabled="true" type="checkbox" ' + checked + '></td>' +
                        '<td>' + item.name + '</td>' +
                        '<td>' + item.creationTime.substr(11, 8) + '</td>' +
                        '<td><button onclick="editItem(' + item.id + ')">Edit</button></td>' +
                        '<td><button onclick="deleteItem(' + item.id + ')">Delete</button></td>' +
                        '<td><button class="move up">Up</button></td>' +
                        '<td><button class="move down">Down</button></td>' +
                        '</tr>').appendTo($('#todos'));
            });

            todos = data;
        }
    });
}
// </snippet_GetData>

// Support for moving items after loading them with ajax up and down.
$(document).on("click", '.move', function (event) {
    //alert("move button clicked!");
    var row = $(this).closest('tr');
    if ($(this).hasClass('up'))
        row.prev().before(row);
    else
        row.next().after(row);
});

// <snippet_AddItem>
function addItem() {
    const item = {
        'name': $('#add-name').val(),
        'isComplete': false
    };

    $.ajax({
        type: 'POST',
        accepts: 'application/json',
        url: uri,
        contentType: 'application/json',
        data: JSON.stringify(item),
        error: function (jqXHR, textStatus, errorThrown) {
            alert('here');
        },
        success: function (result) {
            getData();
            $('#add-name').val('');
        }
    });
}
// </snippet_AddItem>

function deleteItem(id) {
    // <snippet_AjaxDelete>
    $.ajax({
        url: uri + '/' + id,
        type: 'DELETE',
        success: function (result) {
            getData();
        }
    });
    // </snippet_AjaxDelete>
}

function editItem(id) {
    $.each(todos, function (key, item) {
        if (item.id === id) {
            $('#edit-name').val(item.name);
            $('#edit-id').val(item.id);
            $('#edit-isComplete').val(item.isComplete);
        }
    });
    $('#spoiler').css({ 'display': 'block' });
}

$('.my-form').on('submit', function () {
    const item = {
        'name': $('#edit-name').val(),
        'isComplete': $('#edit-isComplete').is(':checked'),
        'id': $('#edit-id').val()
    };

    // <snippet_AjaxPut>
    $.ajax({
        url: uri + '/' + $('#edit-id').val(),
        type: 'PUT',
        accepts: 'application/json',
        contentType: 'application/json',
        data: JSON.stringify(item),
        success: function (result) {
            getData();
        }
    });
    // </snippet_AjaxPut>

    closeInput();
    return false;
});

function closeInput() {
    $('#spoiler').css({ 'display': 'none' });
}
// </snippet_SiteJs>