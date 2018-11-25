//var baseUrl = "http://192.168.0.100/aprender/Consulta.php";
var telaAtual;
//var baseUrl = "http://192.168.0.100/ws_aprender/";
var baseUrl = "https://aprenderwebapps.azurewebsites.net/Consulta.php";

var currentLicao;
var currentfase = 1;
var dependentes = make2DArray(5,7);
var dependenteAtual;
var respostasQuestao = make2DArray(1,2);
var Licao = make2DArray(1,6); 
var Alternativa = make2DArray(4,4);  


document.getElementById('BotaoVoltar').onclick = function(){
    if(telaAtual == "telaCadastro"){
        logout();
    } else if(telaAtual == "telaLogin"){
        if (confirm("Tem certeza que deseja sair?")) {            
            navigator.app.exitApp();        
        }
    } else if(telaAtual == "telaCadastroDependente"){              
        MostraTela("telaDependentes");
    } else if(telaAtual == "telaLicoes"){        
        MostraTela("telaDependentes");
    } else if(telaAtual == "telaDependentes"){
        logout();
    } else if(telaAtual == "telaLicao"){
        MostraTela("telaLicoes");        
    } else if(telaAtual == "telaPontuacao"){
        
    }    
};

document.getElementById('BotaoExcluir').onclick = function(){
    console.log("Clica Botão Excluir Dependente");
    if (confirm("Deseja realmente excluir esse dependente?")) {
        if (confirm("Essa ação é irreversível! Todo seu progresso será perdido!")) 
        {
                var url = baseUrl + "?Procedure=fncExcluirDependente&depentendeID=" + dependentes[dependenteAtual][0];
	           $.ajax({
                type: "GET",
                url: url,
                timeout: 15000,
                datatype: 'JSON',
                contentType: "application/json; charset=utf-8",
                cache: false,
                error: function(xhr, status, error) {
                    console.log(xhr.responseText);         
                    alert("Houve um erro ao excluir esse dependente!");
                },
                success: function(response) {
                    alert("Dependente excluido!");
                    CarregarDependentes(localStorage.getItem("User_ID"));
                    MostraTela("telaDependentes");
                }
            });
        } else {
        }
    } else {
    }
};


window.onload = function() {
                                           
    document.getElementById("BotaoExcluir").classList.add('hidden');
                                        
    
  if(localStorage.getItem("User_Logado") == "1")
{    
    CarregarDependentes(localStorage.getItem("User_ID"));
    MostraTela("telaDependentes");
}

};

function logout(){    
    console.log('logout');
        localStorage.setItem("User_Logado",0);        
        location.reload();      
}

function make2DArray(cols,rows){
    var arr = new Array(cols);
    for(var i=0; i<arr.length;i++){
        arr[i] = new Array(rows);
    }
    return arr;
}

function login() {
    
    var ulogin = document.getElementById("input_ulogin").value;
    var usenha = document.getElementById("input_usenha").value;
    
    var url = baseUrl + "?Tela=Login&Procedure=fncLogin&Login=" + ulogin + "&Senha=" + usenha;
    
    
    $.ajax({
        type: "GET",
        url: url,
        timeout: 15000,
        datatype: 'JSON',
        contentType: "application/json; charset=utf-8",
        cache: false,
        beforeSend: function () {
            //
        },
                error: function(xhr, status, error) {
                    console.log(xhr.responseText);                    
                    alert(xhr.responseText);
            alert("Não foi possivel autenticar esse usuário! Verifique o Login e Senha!");
        },
        success: function (retorno) {
            var registros = retorno;
            $.each(registros, function (i, registro) {               
                
				// Testando validação com Banco de dados
                //alert("Logou: "+registro.Nome);                
                
                localStorage.setItem("User_Logado", 1);
                localStorage.setItem("User_ID", registro.ID);
                localStorage.setItem("User_Nome", registro.Nome);
                localStorage.setItem("User_Login", registro.Login);
                localStorage.setItem("User_Email", registro.Email);
                localStorage.setItem("User_ts_Creat", registro._ts_Creat);
                
//                console.log(registro);
//                console.log(localStorage.Nome);
                
                //document.getElementById("telaLicoes").classList.remove('hidden');                
                //document.getElementById("NomeDep").innerHTML = dependentes[dependenteAtual][2];   
                CarregarDependentes(localStorage.getItem("User_ID"));
                MostraTela("telaDependentes");
                
            });
        }
    });
}

function ShowCadastro(){    
    MostraTela("telaCadastro");
    
}

function ShowCadastroDependente(){
    MostraTela("telaCadastroDependente");
}

function OuvirSom()
{
    console.log("Click: Ouvir Som!");    
    playAudio(Licao[0][4]);
}
function CarregarDependentes(id)
{    	
	var url = baseUrl + "?Procedure=fncListarDependentes&id="+id;
    
    $.ajax({
        type: "GET",
        url: url,
        timeout: 15000,
        datatype: 'JSON',
        contentType: "application/json; charset=utf-8",
        cache: false,
                error: function(xhr, status, error) {
                    //console.log(xhr.responseText);
                    alert("Não foi possivel Carregar seus dependentes!");
                    
                },
                success: function(retorno) {
                    console.log(retorno);                                    
                    $('.addeddependente').remove();
                    var listaDependente = retorno
                    var contador = 0;
                    $.each(listaDependente, function (i, dependente) {
                        dependentes[contador][0] = dependente.ID;
                        dependentes[contador][1] = dependente.Responsavel;
                        dependentes[contador][2] = dependente.Nome;
                        dependentes[contador][3] = dependente.Idade;
                        dependentes[contador][4] = dependente.Sexo;
                        dependentes[contador][5] = dependente.Nivel;
                        dependentes[contador][6] = dependente.Licao;
                        dependentes[contador][7] = dependente.Fase;
                        
                        //var item = '<span class="title">' + dependente.Nome + '</span>';
                        var item = '<span class="title">' + dependente.Nome + '</span>';
                        item += '<p>' + dependente.Idade + ' Anos' + '<br>';
                        item += '<span>' + 'Sexo: ' + dependente.Sexo + '<br><span>';
                        item += '<span>' + 'Nível: ' + dependente.Nivel + '</span>' + '</p>';
                        var li = '<li class="collection-item addeddependente" onclick="CarregaTelaLicoes(this.id)" id='+dependente.ID+'>' + item + '</li>';
//                        console.log(li);                        
                        //$('Lista_Dependentes').append(li);  
                        $("#Lista_Dependentes ul").append(li);
                        contador++;
                        console.log(dependente[contador]);
                    });
                }
            });
}

function CarregaTelaLicoes(id){
    var url = baseUrl + "?Procedure=fncCarregarLicoes&id="+id;
    
    for(var i=0; i<dependentes.length;i++){
        if(dependentes[i][0] == id)
            {                
                dependenteAtual = i;
            }
    }
    console.log("dependente Atual");
    console.log(dependenteAtual);
    
    $.ajax({
        type: "GET",
        url: url,
        timeout: 15000,
        datatype: 'JSON',
        contentType: "application/json; charset=utf-8",
        cache: false,
                error: function(xhr, status, error) {
                    //console.log(xhr.responseText);
                    alert("Não foi possivel Carregar as Lições!");
                    MostraTela("telaDependentes");                    
                },
                success: function(retorno) {                    
                    $('.added').remove();
                    console.log(retorno);
                    var listaLicoes = retorno
                    $.each(listaLicoes, function (i, licao) {                        
                        var item = '<span class="title"><h4>' + licao.Nome + '</h4></span>'+ licao.Descricao+'<br>';
//                        item += '<p>' + dependente.Idade + ' Anos' + '<br>';
                        item += '<span>' + 'Status Atual: ' + licao.Nivel_Completo + '<br><span>';
                        item += '<span>' + 'Data de finalização: ' + licao.Nivel_Dt + '</span>' + '</p>';
                        item += '<span>' + '<center><h6><b>Iniciar Lição!</b></h6></center>';
                        var li = '<li class="collection-item added" onclick="IniciarLicao(this.id)" id='+licao.ID+'>' + item + '</li>';
//                        console.log(li);                        
                        //$('Lista_Dependentes').append(li);  
                        $("#Lista_Licoes ul").append(li);
                        
                        MostraTela("telaLicoes");                        
                        document.getElementById("BotaoExcluir").classList.remove('hidden');
                        
                        
                    });
                }
            });
    
}

function IniciarLicao(id)
{
    console.log("Inicia Licao");
    console.log(id);
//    console.log(dependentes[dependenteAtual][2]);     
    currentLicao = id;
    currentfase = 1;
    CarregarLicao(id);
    MostraTela("telaLicao");
}

function CarregarLicao(id)
{       
    console.log("CarregarLicao");
    console.log(id);
    console.log(currentfase);
    console.log(currentLicao);
    
    if(currentfase == 6) { CarregaTelaLicoes(dependentes[dependenteAtual][0]); }
    
    var url = baseUrl + "?Procedure=fncCarregarLicao&id="+id+"&fase="+currentfase;
    console.log(url);
    $.ajax({
        type: "GET",
        url: url,
        timeout: 15000,
        datatype: 'JSON',
        contentType: "application/json; charset=utf-8",
        cache: false,
                error: function(xhr, status, error) {
                    console.log(xhr.responseText);
                    alert("Não foi possivel Carregar as Lições!");
                    //MostraTela("telaDependentes");                    
                },
                success: function (retorno) {
                    var registros = retorno;
                    $.each(registros, function (i, registro) {               
                        
                        Licao[0][0] = registro.ID;
                        Licao[0][1] = registro.Enunciado;
                        Licao[0][2] = registro.Enunciado_2;
                        Licao[0][3] = registro.Fase_ID;
                        Licao[0][4] = registro.Som;
                        Licao[0][5] = registro.Tipo;
                        
                        console.log(Licao);

                        
                        var url = baseUrl + "?Procedure=fncCarregarLicao_Respostas&id="+Licao[0][0];
                        $.ajax({
                        type: "GET",
                        url: url,
                        timeout: 15000,
                        datatype: 'JSON',
                        contentType: "application/json; charset=utf-8",
                        cache: false,
                                error: function(xhr, status, error) {
                                    console.log(xhr.responseText);
                                    alert("Não foi possivel Carregar as Alternativas!");
                                    //MostraTela("telaDependentes");                    
                                },
                                success: function (retorno) {
                                    var contador = 0;
                                    var registros = retorno;
                                    $.each(registros, function (i, registro) {               

                                        Alternativa[contador][0] = registro.ID;
                                        Alternativa[contador][1] = registro.Pergunta_ID;
                                        Alternativa[contador][2] = registro.Resposta;
                                        Alternativa[contador][3] = registro.Correto;

                                        console.log(Alternativa);

                                        contador++;
                                    });
                                    
                                    if(Alternativa.length == 4)
                                    {
                                        
                                        if(Licao[0][5]== 1){                                            
                                            document.getElementById("Enunciado_2").classList.remove('hidden');                                            
                                            document.getElementById("playsound").classList.add('hidden');
                                        }
                                        else{                                            
                                            document.getElementById("Enunciado_2").classList.add('hidden');                                            
                                            document.getElementById("playsound").classList.remove('hidden');
                                        }   
                                            
                                        
                                        document.getElementById("NomeDependente").innerHTML = dependentes[dependenteAtual][2];          
                                        document.getElementById("FaseAtual").innerHTML = currentfase;          
                                        
                                        
                                        document.getElementById("Enunciado_1").innerHTML = Licao[0][1];            
                                        document.getElementById("Enunciado_2").innerHTML = Licao[0][2];   
                                        
                                                 
                                        document.getElementById("Alternativa1").innerHTML = Alternativa[0][2]; 
                                        document.getElementById("Alternativa2").innerHTML = Alternativa[1][2];  
                                        document.getElementById("Alternativa3").innerHTML = Alternativa[2][2];  
                                        document.getElementById("Alternativa4").innerHTML = Alternativa[3][2];    
                                    }
                                }
                            });
                        
                    });
                }
            });
}

function MostraTela(nometela){
    document.getElementById("telaCadastro").classList.add('hidden');
    document.getElementById("telaLogin").classList.add('hidden');
    document.getElementById("telaCadastroDependente").classList.add('hidden');
    document.getElementById("telaLicoes").classList.add('hidden');
    document.getElementById("telaDependentes").classList.add('hidden');
    document.getElementById("telaLicao").classList.add('hidden');
    document.getElementById("telaPontuacao").classList.add('hidden');

    document.getElementById("BotaoExcluir").classList.add('hidden');
    
    document.getElementById(nometela).classList.remove('hidden');    
    telaAtual = nometela;
}

function Cadastro(){

	var Nome 	= document.getElementById("input_CadastroNome").value;
	var Email 	= document.getElementById("input_CadastroEmail").value;
	var Login 	= document.getElementById("input_CadastroLogin").value;
	var Senha 	= document.getElementById("input_CadastroSenha").value;
	
	var url = baseUrl + "?Procedure=fncCadastrar&Nome=" + Nome + "&Email=" + Email + "&Login=" + Login + "&Senha=" + Senha;
    
    //dados = "{'Nome':'" + $Nome+ "', 'Email':'" + $Email+ "', 'Email':'" + $Email+ "', 'data3':'" + value3+ "'}",
    
    var dados = [
        {"Procedure": "fncCadastrar", "Nome":Nome, "Email":Email, "Login":Login, "Senha":Senha}        
    ]
        
    console.log(dados);
    
	$.ajax({
        type: "GET",
        url: url,
        timeout: 15000,
        datatype: 'JSON',
        contentType: "application/json; charset=utf-8",
        cache: false,
                error: function(xhr, status, error) {
                    console.log(xhr.responseText);                    
                    alert(xhr.responseText);
                    //alert("Não foi possivel cadastrar!");
                },
                success: function(response) {
					alert("Cadastro realizado!");
                    location.reload();
                }
            });
}	

function botao1_Click()
{
    respostasQuestao[0][0] = Licao[0][0];
    respostasQuestao[0][1] = Alternativa[0][0];
    enviarresposta();
}

function botao2_Click()
{
    respostasQuestao[0][0] = Licao[0][0];
    respostasQuestao[0][1] = Alternativa[1][0];   
    enviarresposta(); 
}

function botao3_Click()
{
    respostasQuestao[0][0] = Licao[0][0];
    respostasQuestao[0][1] = Alternativa[2][0]; 
    enviarresposta();   
}

function botao4_Click()
{
    respostasQuestao[0][0] = Licao[0][0];
    respostasQuestao[0][1] = Alternativa[3][0];  
    enviarresposta();  
}


function enviarresposta(){
    
    console.log("enviarResposta!");
    var url = baseUrl + "?Procedure=fncEnviaResposta&depentendeID=" + dependentes[dependenteAtual][0] + "&perguntaID=" + respostasQuestao[0][0] + "&respostaID=" + respostasQuestao[0][1]+"&currentfase="+currentfase;
	$.ajax({
        type: "GET",
        url: url,
        timeout: 15000,
        datatype: 'JSON',
        contentType: "application/json; charset=utf-8",
        cache: false,
                error: function(xhr, status, error) {
                    console.log(xhr.responseText);                    
                    alert(xhr.responseText);
                    //alert("Não foi possivel cadastrar!");
                },
                success: function(response) {
                    currentfase ++;
                    CarregarLicao(currentLicao);
                }
            });
    
}
function cadastroDependente()
{		
    console.log("Chamou Cadastro Dependente!");
    var Nome = document.getElementById("frmCadastroDep_Nome").value;
    var Idade = document.getElementById("frmCadastroDep_Idade").value;
    var Sexo = document.getElementById("frmCadastroDep_Sexo").value;
	var Nivel;
	
	var radios = document.getElementsByName('Nivel_AlfabetizacaoDep');

	for (var i = 0, length = radios.length; i < length; i++)
	{
	 if (radios[i].checked)
	 {
		Nivel = radios[i].value;
		break;
	 }
	}
    
/*    console.log(Nome);
    console.log(Idade);
    console.log(Sexo);
    console.log(Nivel);
*/	
	var url = baseUrl + "?Procedure=fncCadastrarDependente&user_ID=" + localStorage.getItem("User_ID") + "&Nome=" + Nome + "&Idade=" + Idade + "&Sexo=" + Sexo + "&Nivel=" + Nivel;
	$.ajax({
        type: "GET",
        url: url,
        timeout: 15000,
        datatype: 'JSON',
        contentType: "application/json; charset=utf-8",
        cache: false,
                error: function(xhr, status, error) {
                    console.log(xhr.responseText);                    
                    alert(xhr.responseText);
                },
                success: function(response) {
					alert("Cadastro realizado!");
                    location.reload();
                }
            });
}

function playAudio(url) {
    // Play the audio file at url
    var my_media = new Media(url,
        // success callback
        function () {
            console.log("playAudio():Audio Success");
        },
        // error callback
        function (err) {
            console.log("playAudio():Audio Error: " + err);
            console.log(err);
        }
    );
    // Play audio
    my_media.play();
}