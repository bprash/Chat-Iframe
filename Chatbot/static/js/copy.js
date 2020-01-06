var botui = new BotUI('reminder-bot');

    function messages(dict) {
        botui.message
            .bot({
                loading: true,
                delay: 2000,
                content: 'Hi, my name is Teller! I can help you with your Bank related queries. Please select a quick link below'
            })
            .then(function() {
                return botui.action.button({
                    delay: 1000,
                    action: [{
                        text: 'Loan Application',
                        value: 'loan'
                    }, {
                        text: 'Interest rates',
                        value: 'intrates'
                    }, {
                        text: 'Account Information',
                        value: 'account'
                    }, {
                        text: 'I have some other query',
                        value: 'other'
                    }]
                })
            }).then(function(res) {
                if (res.value == 'loan') {
                    botui.message
                        .bot({
                            loading: true,
                            delay: 1000,
                            content: 'Great! Just answer a few questions and we\'ll get your loan application started.',
                        })
                        .then(function() {
                            return botui.action.button({
                                delay: 1000,
                                action: [{
                                    text: 'Okay!',
                                    value: 'yes'
                                }, {
                                    text: 'No, I have a different query!',
                                    value: 'no'
                                }]
                            })
                        }).then(function(res) {
                            if (res.value == 'yes') {
                                botui.message
                                    .bot({
                                        delay: 500,
                                        content: 'Please enter your full name'
                                    }).then(function() {
                                        return botui.action.text({
                                            delay: 1000,
                                            action: {
                                                placeholder: 'Arun, Kumar'
                                            }
                                        })
                                    }).then(function(res) {
                                        if (res.value !== null) {
                                            dict['name'] = res.value;
                                            console.log(dict)
                                            // pass_data('loan','name', res.value) //this is where  i pass this data to the backend
                                            botui.message
                                                .bot({
                                                    delay: 500,
                                                    content: 'Please enter your age',
                                                }).then(function() {
                                                    return botui.action.text({
                                                        delay: 1000,
                                                        action: {
                                                            placeholder: '30'
                                                        }
                                                    })
                                                }).then(function(res) {
                                                    if (res.value != null) {
                                                        dict['age'] = res.value;
                                                        // pass_data('loan','age', res.value)
                                                    }

                                                }).then(function() {
                                                    botui.message
                                                        .bot({
                                                            loading: true,
                                                            delay: 1000,
                                                            content: 'Thank you for answering the questions. We have noted your details and will get back to you shortly',
                                                            }).then(function(){
                                                              botui.message.bot({
                                                            loading: true,
                                                            delay: 1000,
                                                            content: 'In case of any other queries, please click on the button below',
                                                            }).then(function(){
                                                              return botui.action.button({
                                                                      delay: 1000,
                                                                      action: [{
                                                                          text: 'Okay!',
                                                                          value: 'yes'
                                                                      }, {
                                                                          text: 'No, I have a different query!',
                                                                          value: 'no'
                                                                      }]
                                                                  }).then(function(res){
                                                                    if(res.value == 'no'){
                                                                      return botui.action.text({
                                                                                delay: 1000,
                                                                                action: {
                                                                                    placeholder: 'Type your query'
                                                                                }
                                                                            }).then(function(res){
                                                                               dict['query'] = res.value;
                                                                            })

                                                                      .then(function(){
                                                                              botui.message.bot({
                                                                                loading:true,
                                                                                delay:1000,
                                                                                content:'We have noted it down and will get back shortly. If there is anything else you want us to help you with please let us know'
                                                                              }).then(function(){
                                                                                return botui.action.button({
                                                                      delay: 1000,
                                                                      action: [{
                                                                          text: 'Thank you!',
                                                                          value: 'yes'
                                                                      }]
                                                                  }).then(function(){
                                                                     pass_data(dict) 
                                                                  })
                                                                              })
                                                                            })
                                                                    }
                                                                  })
                                                                                                  })
                                                            })
                                                })
                                        }
                                    })
                            } else {
                                customquery(dict);
                            }
                        });
                    //an empty string and the res.value will be passed to the function
                    //res.value contains the type of button clicked.
                }
                if (res.value == 'other') {
                    customquery(dict);
                }
            });
    }
    var customquery = function(dict) {

        botui.message.bot({
                delay: 2000,
                loading: true,
                cssClass: 'custom-class',
                content: 'Take a look at the common queries below. If you don\'t find yours in them, feel free to type it out!'
            })
            .then(function() {
                return botui.action.button({
                    delay: 2000,
                    action: [{
                        text: 'Bank interest rates',
                        value: 'intrates'
                    }, {
                        text: 'How to apply for a home loan?',
                        value: 'homeloanapplication'
                    }, {
                        text: 'Type my query!',
                        value: 'customquery'
                    }]
                })
            }).then(function(res) {
                if (res.value == 'customquery') {
                    botui.message
                        .bot({
                            delay: 500,
                            content: 'You can type your query below!'
                        }).then(function() {
                            return botui.action.text({
                                delay: 1000,
                                action: {
                                    placeholder: 'Type here...'
                                }
                            })
                        }).then(function(res) {
                            botui.message
                                .bot({
                                    delay: 500,
                                    content: 'Your query is : ' + res.value,
                                })
                            dict['query'] = res.value;
                            // pass_data('query','query', res.value) //where i pass the query back to the flask side 
                        }).then(function(res) {

                            botui.message
                                .bot({
                                    loading: true,
                                    delay: 1500,
                                    content: 'Thank you for your concern. We will get back to you on the same shortly.',
                                })
                        }).then(function() {
                            pass_data(dict);
                        })
                }
            })
    }

    var pass_data = function(dict) {


        console.log(dict)
        axios({
                method: 'post',
                url: 'http://127.0.0.1:8000/datapost',
                data: dict,
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(function(response) {
                //console.log("Hi")
                dict2 = response;
                console.log(dict2.data.value);
            })
            .catch(function(error) {
                console.log(error);
            });

    }




    function openForm() {


        document.getElementById("myForm").style.display = "block";
        console.log('opened')


        dict = {};
        messages(dict);

    }

    function closeForm() {
        // $('#hi').empty();
        console.log('closed')

        document.getElementById("myForm").style.display = "none";

        // $( "#hi" ).load(window.location.href + " #hi" )
        botui.message.removeAll();
        botui.action.hide();

    }