
function initialize() {
    let form = document.getElementById('frontend_certification_form');
    let form_update = document.getElementById('frontend_certification_form-update');
    let registers_list = document.getElementById('lista-cadastros');

    function renderValue(evt) {
        let value = evt.target.value;
        let value_render = document.querySelector(`#valor-${evt.target.id} > span`);
        value_render.innerText = value;
    }
    
    function initInputChangeWatch() {
        let inputs = form.querySelectorAll('.input-field');

        inputs.forEach(function(input) {
            input.addEventListener('keyup', renderValue);
        })
    }
    
    function loadValidations() {
        $('.frontend-cert').form({
            on: 'blur',
            fields: {
              name: {
                identifier: 'nome',
                rules: [
                  {
                    type   : 'empty',
                    prompt : 'Informe seu nome.'
                  }
                ]
              },
              email: {
                identifier: 'email',
                rules: [
                  {
                    type   : 'empty',
                    prompt : 'Informe seu e-mail.'
                  },
                  {
                      type: 'regExp',
                      value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      prompt : 'Informe um e-mail válido.'
                  }
                ]
              },
              phone: {
                identifier: 'telefone',
                rules: [
                  {
                    type   : 'empty',
                    prompt : 'Informe seu telefone.'
                  },
                  {
                      type: 'regExp',
                      value: /(\(\d{2}\)\s)(\d{4,5}\-\d{4})/g,
                      prompt : 'Informe um telefone válido.'
                  }
                ]
              },
              about: {
                identifier: 'assunto',
                rules: [
                  {
                    type   : 'empty',
                    prompt : 'Informe o assunto.'
                  }
                ]
              },
              message: {
                  identifier: 'mensagem',
                  rules: [
                      {
                          type   : 'empty',
                          prompt : 'Digite a sua mensagem.'
                      }
                  ]
              }
            }
        });
    }

    function getDataInSession() {
        let data = sessionStorage.getItem('cadastros');
        return data ? JSON.parse(data) : [];
    }
    
    function saveDataInSession(formData) {

        let id = formData.get('id');
        let registers = getDataInSession();
        let new_register = {};

        for(let value of formData.entries()) {
            new_register[value[0]] = value[1];
        }

        if(id) {
            registers[parseInt(id)] = new_register;
        } else {
            registers.push(new_register);
        }
        sessionStorage.setItem('cadastros', JSON.stringify(registers));
    }
    
    function handleSubmit(evt) {
        evt.preventDefault();

        if($(evt.target).form('is valid')) {
            let form = evt.target;
            let data = new FormData(form);
            saveDataInSession(data);
            window.location.href = 'https://suavecomunicacao.plataformaneo.com.br/hotsite/atualizar';
        }
    }

    function loadSessionData() {
        let inputs = form_update.querySelectorAll('.input-field');

        inputs.forEach(function(input) {
            let input_name = input.getAttribute('name');
            let session_value = sessionStorage.getItem(input_name);

            if(session_value) {
                if(input.nodeName.toLowerCase() === 'textarea') {
                    input.innerText = session_value;
                } else {
                    input.value = session_value;
                }
            }
        })
    }

    function createListItem(id, name, email) {
        let container = document.createElement('div');
        container.classList.add('item');

        let button_container = document.createElement('div');
        button_container.classList.add('right', 'floated', 'content');

        let edit_button = document.createElement('div');
        edit_button.classList.add('ui', 'button');
        edit_button.innerText = 'Editar';
        edit_button.setAttribute('data-id', id);

        let content = document.createElement('div');
        content.classList.add('content');
        content.innerText = `${name}(${email})`;

        button_container.appendChild(edit_button);
        container.appendChild(button_container);
        container.appendChild(content);

        return container;
    }

    function renderRegisterList() {
        let registers = getDataInSession();

        registers.forEach((register, index) => {
            let item = createListItem(index, register.nome, register.email);
            registers_list.appendChild(item);
        });
    }

    function handleEditButtonClick(evt) {
        let id = parseInt(evt.target.getAttribute('data-id'));
        let session_data = getDataInSession();
        let editing_register = session_data[id];

        form_update.querySelector('[name="id"]').value = id;
        
        let inputs = form_update.querySelectorAll('.input-field');

        inputs.forEach(function(input) {
            let input_name = input.getAttribute('name');
            let session_value = editing_register[input_name];

            if(session_value) {
                if(input.nodeName.toLowerCase() === 'textarea') {
                    input.innerText = session_value;
                } else {
                    input.value = session_value;
                }
            }
        })

        $('.modal#frontend-modal').modal('show');
    }

    function loadButtonsEvent() {
        let edit_buttons = registers_list.querySelectorAll('.button');

        edit_buttons.forEach(function(button) {
            button.addEventListener('click', handleEditButtonClick);
        });
    }

    loadValidations();

    if(form) {
        initInputChangeWatch();
        form.addEventListener('submit', handleSubmit);
    }

    if(form_update) {
        loadSessionData();
        form_update.addEventListener('submit', handleSubmit);
    }

    if(registers_list) {
        renderRegisterList();
        loadButtonsEvent();
    }
}

$(function () {
   initialize();
});