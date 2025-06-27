const safira= '../../assets/img/medalhas/Medal-Safira.png'
const rubi = '../../assets/img/medalhas/Medal-Rubi.png'
const diamante = '../../assets/img/medalhas/Medal-Diamante.png'
const ouro = '../../assets/img/medalhas/Medal-Ouro.png'
const prata = '../../assets/img/medalhas/Medal-Prata.png'
const bronze = '../../assets/img/medalhas/Medal-Bronze.png'

$(document).ready(function(){
    var dados = {operacao: 'read'}
    

    $('#table-pontuacao').empty()
    var i=1
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        assync: true,
        data: JSON.stringify(dados),
        url: '../../../backend/models/rankModel.php',
        success: function(dados){
            for(const dado of dados){
                if(i==1){
                    var medal = safira
                }
                if(i==2){
                    var medal = rubi
                }
                if(i==3){
                    var medal = diamante
                }
                
                $('#table-pontuacao').append(`
                <tr>
                    <td><img src="${medal}" class="img-medalha"></td>
                    <td>${dado.nome}</td>
                    <td>${dado.pontuacao}</td>
                </tr>
                `)
                i++
            }
        }
    })


    $('#table-tempo').empty()
    var j=1
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        assync: true,
        data: JSON.stringify(dados),
        url: '../../../backend/models/rank_tempModel.php',
        success: function(dados){
            for(const dado of dados){
                if(j==1){
                    var medal = ouro
                }
                if(j==2){
                    var medal = prata
                }
                if(j==3){
                    var medal = bronze
                }

                var t = dado.tempo
                t = t.slice(0, -3)
                
                $('#table-tempo').append(`
                <tr>
                    <td><img src="${medal}" class="img-medalha"></td>
                    <td>${dado.nome}</td>
                    <td>${t}</td>
                </tr>
                `)
                j++
            }
        }
    })
})