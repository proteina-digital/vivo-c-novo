var ufs = '<option value="AC">AC</option><option value="AL">AL</option><option value="AM">AM</option><option value="AP">AP</option><option value="BA">BA</option><option value="CE">CE</option><option value="DF">DF</option><option value="ES">ES</option><option value="GO">GO</option><option value="MA">MA</option><option value="MT">MT</option><option value="MS">MS</option><option value="MG">MG</option><option value="PA">PA</option><option value="PB">PB</option><option value="PR">PR</option><option value="PE">PE</option><option value="PI">PI</option><option value="RJ">RJ</option><option value="RN">RN</option><option value="RO">RO</option><option value="RS">RS</option><option value="RR">RR</option><option value="SC">SC</option><option value="SE">SE</option><option value="SP">SP</option><option value="TO">TO</option>';

var ddds = {
    "AC": ["68"],
    "AL": ["82"],
    "AM": ["92", "97"],
    "AP": ["96"],
    "BA": ["71", "73", "74", "75", "77"],
    "CE": ["85", "88"],
    "DF": ["61"],
    "ES": ["27", "28"],
    "GO": ["62", "64"],
    "MA": ["98", "99"],
    "MG": ["31", "32", "33", "34", "35", "37", "38"],
    "MS": ["67"],
    "MT": ["65", "66"],
    "PA": ["91", "93", "94"],
    "PB": ["83"],
    "PE": ["81", "87"],
    "PI": ["86", "89"],
    "PR": ["41", "42", "43", "44", "45", "46"],
    "RJ": ["21", "22", "24"],
    "RN": ["84"],
    "RO": ["69"],
    "RR": ["95"],
    "RS": ["51", "53", "54", "55"],
    "SC": ["47", "48", "49"],
    "SE": ["79"],
    "SP": ["11", "12", "13", "14", "15", "16", "17", "18", "19"],
    "TO": ["63"]
}

$(document).on('change', '.escolha-estado', function(event) {
  event.preventDefault();
  var uf = $(this).val();

  if (ddds[uf].length > 0) {
    var select_ddd = $(".escolha-ddd");
    select_ddd.find("option").first().text("DDD");
        select_ddd.find('option').not(':first').remove();
    for (var i = 0; i < ddds[uf].length; i++) {
      select_ddd.append('<option value="'+ddds[uf][i]+'">'+ddds[uf][i]+'</option>');
    }
  }

});

$(document).on('change', '.escolha-ddd', function(event) {
  event.preventDefault();
});

function checa_cookie_ddd(){
  if (readCookie('ddd') && readCookie('uf')) {
    console.log(readCookie('uf'));
      $(".modal-ddd").css('display', 'none');
      // $(".place-uf").html(readCookie('uf'));
      $(".place-uf").html(`${readCookie('uf')} (${readCookie('ddd')})`);
      get_precos(readCookie('ddd'), readCookie('uf'), null);
      return true;
  }else{
      $(".modal-ddd").css('display', 'block');
      return false;
  }
}

function trata_preco_api(valor){
  var valores = valor.toString().split(".");
  return [valores[0], valores[1]];
}

Array.prototype.move = function (from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};


function popula_cards(planos, classe, uf, cidade, ddd){

  console.log(planos.length);

    // PEGA OS ELEMENTOS DO CELULAR
    if ($(window).width() > 990) {
      var wrap_box_planos = $(".wrap.box-planos."+classe).children();
      planos.move(0,1);
    }else{
      // var wrap_box_planos = $(".mask-slide").children().children();
      var wrap_box_planos = $(".c_slide_produtos."+classe).children().children().children();
    }
    

    $(wrap_box_planos).each(function(index, el) {
      $(this).find('.box-titulo .box-titulo-destaque').html(planos[index]["info_plano"]["dados"].replace("GB", ''));
      $(this).find('.box-preco-valor-destaque').html(trata_preco_api(planos[index]["valores_plano"]["valor_oferta"])[0]);
      $(this).find('.box-preco-centavos-destaque').html(","+trata_preco_api(planos[index]["valores_plano"]["valor_oferta"])[1]+"*<br>");
      $(this).find('.bonus_txt').html(planos[index]["info_plano"]["dados_detalhe"]);

      

      if ( planos[index]["info_plano"]["apps_add"] != null ) {

        $(this).find('.txt_velocidade').html( planos[index]["info_plano"]["apps_add"]["titulo"] );
      }



      var box_topicos_ver_mais = $(this).find(".wrap.box-topicos.ver_mais.none").last();
      

      for (var d = 0; d < planos[index]["info_plano"]["detalhe"].length; d++) {
          if (d == 0 || d == 1) {
            continue;
          }

          box_topicos_ver_mais.after('<div class="wrap box-topicos ver_mais none"><div class="set c_ontop"><img src="https://uploads-ssl.webflow.com/5babd501fb0eee25943c30a1/5ce58cbd98314d97a5f11baa_check.png" alt="Modem Grátis" class="box-topico-icon c_menor"></div><div class="set apps_box"><div class="box-topico-txt">'+"<strong>"+planos[index]["info_plano"]["detalhe"][d].replace(/ .*/,'')+"</strong><br><span class='topico_subtext'>"+planos[index]["info_plano"]["detalhe"][d].replace(planos[index]["info_plano"]["detalhe"][d].replace(/ .*/,''),'')+'</span></div></div></div>');
      }


      $(this).find("a.abre_loja").attr("data-preco", planos[index]["valores_plano"]["valor_oferta"]);
      $(this).find("a.abre_loja").attr("data-ddd", ddd);
      $(this).find("a.abre_loja").attr("data-uf", uf);
      $(this).find("a.abre_loja").attr("data-sku", planos[index]["sku"]);
      $(this).find("a.abre_loja").attr("data-nome", planos[index]["info_plano"]["dados"]);

      $(this).parent().attr('data-sku', planos[index]["sku"]);

    });


    // var destaque_btn = wrap_box_planos.find(".box-c.key").find(".abre_loja");

    // $("a.c_btn.c_shadow.menor.amarelo.abre_loja.cta.w-button").attr("data-preco", destaque_btn.attr("data-preco")).attr("data-ddd", destaque_btn.attr("data-ddd")).attr("data-uf", destaque_btn.attr("data-uf")).attr("data-sku", destaque_btn.attr("data-sku")).attr('data-nome', destaque_btn.attr("data-nome"));

    // $("a.c_btn.c_shadow.menor.amarelo.abre_loja.no-shadow.w-button").attr("data-preco", destaque_btn.attr("data-preco")).attr("data-ddd", destaque_btn.attr("data-ddd")).attr("data-uf", destaque_btn.attr("data-uf")).attr("data-sku", destaque_btn.attr("data-sku")).attr('data-nome', destaque_btn.attr("data-nome"));
}



var get_precos = function(ddd, uf, cidade){
  var serializeDados = {"uf": uf,"cidade": cidade,"ddd": ddd};
  var btn = $(".form-ddd-btn");

  console.log(serializeDados);

  $.ajax({
    url: 'https://catalogo-vivo.automatuslab.com/api/Catalogo/DisponibilidadeMovel',
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    type: 'POST',
    // cache: true,
    data: JSON.stringify(serializeDados),
    beforeSend: function() {
      btn.val( "Aguarde..." );
    },
    success: function(data, textStatus) {

      var planos = [];
      cont = 0;


      var planos_promo = [];
      cont_promo = 0;

      

      for (var i = 0; i < data.portfolio.controle.length; i++) {
        if (data.portfolio.controle[i]["info_plano"]["tipo_fatura"] == "Digital" && data.portfolio.controle[i]["info_plano"]["view"] == "TRUE" && data.portfolio.controle[i]["info_plano"]["campanha"] == "default") {
          planos[cont] = data.portfolio.controle[i];
          cont++;
        }

        if (data.portfolio.controle[i]["info_plano"]["tipo_fatura"] == "Digital" && data.portfolio.controle[i]["info_plano"]["view"] == "FALSE" && data.portfolio.controle[i]["info_plano"]["campanha"] == "promo-app") {
          planos_promo[cont_promo] = data.portfolio.controle[i];
          cont_promo++;
        }
      }

      // PLANOS NÃO PROMOCIONAIS
      popula_cards(planos, 'sem_promocao', uf, cidade, ddd);
      
      // PLANOS PROMOCIONAIS
      popula_cards(planos_promo, 'com_promocao', uf, cidade, ddd);
      
      if (data.portfolio.controle.length > 0) {
        $(".modal-ddd").css('display', 'none');
        $(".area-boxes").removeClass('blur');
        // $(".place-uf").html(uf);
        $(".place-uf").html(`${readCookie('uf')} (${readCookie('ddd')})`);
        document.cookie = "uf = "+uf+"; path=/";
        document.cookie = null;
        document.cookie = "ddd = "+ddd+"; path=/";
      }
    },
    error: function(xhr,er) {
      console.log('Error ' + xhr.status + ' - ' + xhr.statusText + ' - Tipo de erro: ' + er);
    },
    complete: function(){
        btn.val( "Continuar" );

        if ($(window).width() > 990) {
          var wrap_box_planos = $(".wrap.box-planos.sem_promocao").children();
        }else{
          var wrap_box_planos = $(".c_slide_produtos.sem_promocao").children().children().children();
        }

        $('.velocidade-destaque').html(wrap_box_planos.find(".box-c.key").find(".box-titulo-destaque").html());
        $(".c_texto.c_preco").empty().html( wrap_box_planos.find(".box-c.key").find('.box-preco-valor-destaque').html() );
        $(".c_texto.c_centavos").empty().html( wrap_box_planos.find(".box-c.key").find('.box-preco-centavos-destaque').html()  );

    var destaque_btn = wrap_box_planos.find(".box-c.key").find(".abre_loja");

      $("a.c_btn.c_shadow.menor.amarelo.abre_loja.cta.w-button").attr("data-preco", destaque_btn.attr("data-preco")).attr("data-ddd", destaque_btn.attr("data-ddd")).attr("data-uf", destaque_btn.attr("data-uf")).attr("data-sku", destaque_btn.attr("data-sku")).attr('data-nome', destaque_btn.attr("data-nome"));

      $("a.c_btn.c_shadow.menor.amarelo.abre_loja.no-shadow.w-button").attr("data-preco", destaque_btn.attr("data-preco")).attr("data-ddd", destaque_btn.attr("data-ddd")).attr("data-uf", destaque_btn.attr("data-uf")).attr("data-sku", destaque_btn.attr("data-sku")).attr('data-nome', destaque_btn.attr("data-nome"));

    }
  });     
}

$.fn.extend({
    toggleText: function(a, b){
        return this.text(this.text() == b ? a : b);
    }
});

$('.toggle_speed').on('click', function() {
  $(this).toggleClass('selected');

  $('.sem_promocao').toggleClass('none');
  $('.com_promocao').toggleClass('none');


});

$('.mais_ben_btn').on('click', function() {
  $(this).parent().find('.toggle_last').toggleClass('last');
  $(this).parent().find('.ver_mais').toggleClass('none');
  $(this).parent().find('.icon_ben').toggleClass('none');
  $(this).parent().find('.ben_txt').toggleText('Menos Benefícios', 'Mais Benefícios');
});

$('form[name="wf-form-Formulario-DDD"]').submit(function(event) {
  var form = $(this);
  var ddd = form.find("select[name='escolha_ddd'] option:selected").val();
  var uf = form.find("select[name='escolha_estado'] option:selected").val();
  var cidade = null;
  get_precos(ddd, uf, cidade);
  event.preventDefault();
  return false;
});



$(document).on('click', '.ghost_ddd', function(event) {
  $('.modal-ddd.in_c').css('display', 'none');

  if (checa_cookie_ddd() == false) {
    get_precos(21, 'RJ', null);
  }
});

$(document).on('click', '.fechar-modal-ddd', function(event) {
  if (checa_cookie_ddd() == false) {
    get_precos(21, 'RJ', null);
  }
});

$(".escolha-estado").append(ufs);
Webflow.push(function() {
    checa_cookie_ddd();
    $('.com_promocao').addClass('none');
});
