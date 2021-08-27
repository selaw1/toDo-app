function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const buildList = () => {
    const wrapper = document.getElementById("list-wrapper")
    const url = 'https://task-apiapp.herokuapp.com/api/task-list/'
    
    wrapper.innerHTML = ''

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data)

            // Creating the tasks 
            let list = data;
            list.forEach(element => { 
            
                let title = `<span class="title">${element.title}</span>`
                if (element.completed){
                    title = `<strike class="title">${element.title}</strike>`
                }

                const item = `
                <div id="data-row-${element.id}" class="task-wrapper flex-wrapper">
                    <div style="flex:7">${title}</div>
                    <div style="flex:1">
                        <button class="btn btn-sm btn-outline-dark edit">Edit</button>
                    </div>
                    <div style="flex:1">
                        <button class="btn btn-sm btn-danger delete">Delete</button>
                    </div>
                </div>
                `
                wrapper.innerHTML += item;
            });


            // Adding an eventlistner to all edit/delete buttons
            for (const i in data) {
                const editbtn = document.getElementsByClassName("edit")[i]
                const deletebtn = document.getElementsByClassName("delete")[i]
                const itembtn = document.getElementsByClassName("title")[i]

                editbtn.addEventListener('click', (function(item) {
                    return function(){
                        editItem(item)
                    }
                })(data[i]))

                deletebtn.addEventListener('click', (function(item) {
                    return function(){
                        deleteItem(item)
                    }
                })(data[i]))

                itembtn.addEventListener('click', (function(item) {
                    return function(){
                        toggleStrike(item)
                    }
                })(data[i]))

            }
        });        
    }

const editItem = item => {
    console.log('item clicked for EDIT', item)
    activeItem = item;
    document.getElementById('title').value = activeItem.title;
};

const deleteItem = (item) => {
    console.log('item clicked for DELETE', item)
    const url = `https://task-apiapp.herokuapp.com/api/task-delete/${item.id}`;

    fetch(url, {
        method:'DELETE',
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrfToken,
        }
    }).then(response => buildList())
};

const toggleStrike = item => {
    console.log('Strike Toggled for: ', item)
    const url = `https://task-apiapp.herokuapp.com/api/task-update/${item.id}/`;
    item.completed = !item.completed;

    fetch(url, {
        method:'PUT',
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrfToken,
        },
        body:JSON.stringify({'title':item.title, 'completed':item.completed})
    }).then(response => buildList())

}


let activeItem = null;
const form = document.getElementById("form-wrapper");
const csrfToken = getCookie('csrftoken')

form.addEventListener('submit', function(e){
    e.preventDefault()
    console.log('form submitted')

    let method = 'POST';
    let url = 'https://task-apiapp.herokuapp.com/api/task-create/';
    
    if (activeItem){
        method = 'PUT';
        url = `https://task-apiapp.herokuapp.com/api/task-update/${activeItem.id}/`;
        activeItem = null;
    }

    const title = document.getElementById("title").value
    fetch(url, {
        method:method,
        headers:{
            'Content-Type': 'application/json',
            'x-CSRFToken': csrfToken
        },
        body:JSON.stringify({'title':title})
    })
    .then(response =>{
         buildList()
         document.getElementById('form').reset()
    })
})

buildList()
