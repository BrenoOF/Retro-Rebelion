$(document).ready(function(){
    var dados = {
        operacao: 'create', 
        nome: sessionStorage.getItem('nome'),
        pontuacao: sessionStorage.getItem('pontuacao')
    }

    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        assync: true,
        data: JSON.stringify(dados),
        url: '../../../backend/models/rankModel.php',
        success: function(dados){
            console.log(dados)
        }
    })

    var dados = {
        operacao: 'create', 
        nome: sessionStorage.getItem('nome'),
        tempo: sessionStorage.getItem('tempoDecorrido')
    }
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        assync: true,
        data: JSON.stringify(dados),
        url: '../../../backend/models/rank_tempModel.php',
        success: function(dados){
            console.log(dados)
        }
    })
})