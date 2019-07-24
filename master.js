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
    change_ufs(ddds, uf);
});

$(document).on('change', '.escolha-ddd', function(event) {
    event.preventDefault();
});

/// MODAL ANTIFULGA

let timeout;
let first_time = true;
const modal_antifulga_session = $('#modal-antifulga');

function onInactive(ms, cb) {
    if(first_time) {
        var wait = setTimeout(cb, ms);
    }

    // document.onmousemove = document.mousedown = document.mouseup = document.onkeydown = document.onkeyup = document.focus = function () {
    //     clearTimeout(wait);
    //     wait = setTimeout(cb, ms);
    // };
}


function abrir_antifulga() {
    modal_antifulga_session.css("display", "flex")
    .hide()
    .fadeIn();

    first_time = false;
}

function fechar_antifulga() {
    modal_antifulga_session.fadeOut();
}

var addEvent = function(obj, evt, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(evt, fn, false);
    }
    else if (obj.attachEvent) {
        obj.attachEvent("on" + evt, fn);
    }
};


function change_ufs(ddds, uf){
    console.log('ddds: '+ddds);

    if (ddds[uf].length > 0) {
        $("")
        var select_ddd = $(".escolha-ddd");
        select_ddd.find("option").first().text("DDD");
        select_ddd.find('option').not(':first').remove();
        for (var i = 0; i < ddds[uf].length; i++) {
            select_ddd.append('<option value="' + ddds[uf][i] + '">' + ddds[uf][i] + '</option>');
        }
        select_ddd.find('option').first().next().attr('selected','selected');
    }
}


function removerAcentos(s) { return s.normalize('NFD').replace(/[\u0300-\u036f|\u00b4|\u0060|\u005e|\u007e]/g, "") }


function displayLocationInfo(position) {
    // console.log(position);

    $.get( "https://maps.googleapis.com/maps/api/geocode/json?latlng="+ position.coords.latitude + "," + position.coords.longitude +"&sensor=false&key=AIzaSyDN6lma9YSGfs0oRG33hQiUaj9sydo2upc", function(data) {
      // console.log(data);

      CEP = data.results[0].address_components.filter(function (obj) { return obj.types[0] == "postal_code"; })[0].short_name;
      // Logradouro = data.results[0].address_components.filter(function (obj) { return obj.types[0] == "route"; })[0].long_name;
      Estado = data.results[0].address_components.filter(function (obj) { return obj.types[0] == "administrative_area_level_1"; })[0].short_name;
      Cidade = data.results[0].address_components.filter(function (obj) { return obj.types[0] == "administrative_area_level_2"; })[0].long_name;
      // Bairro = data.results[0].address_components.filter(function (obj) { return obj.types[0] == "political"; })[0].short_name;

      console.log(removerAcentos(Cidade));

      get_precos(null, Estado, removerAcentos(Cidade));

    });
}

function getErrorGeoLocation(err) {
    console.log(err);
}


function checa_cookie_ddd() {
    if (readCookie('uf') && (readCookie('ddd') || readCookie('cidade')) ) {
        console.log(readCookie('uf'));
        $(".modal-ddd").css('display', 'none');
        get_precos(readCookie('ddd'), readCookie('uf'), readCookie('cidade'));
        return true;
    } else {
        $(".modal-ddd").css('display', 'block');
        return false;
    }
}

function trata_preco_api(valor) {
    var valores = valor.toString().split(".");
    return [valores[0], valores[1]];
}
Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};


function popula_modal_antifulga(plano, ddd, uf) {

    // modal anti fulga
    let modal_antifulga = modal_antifulga_session.children();

    modal_antifulga.find('.box-titulo .box-titulo-destaque').empty().html(plano["info_plano"]["dados"].replace("GB", ''));
    modal_antifulga.find('.box-preco-valor-destaque').html(trata_preco_api(plano["valores_plano"]["valor_oferta"])[0]);
    modal_antifulga.find('.box-preco-valor-destaque').next().html("," + trata_preco_api(plano["valores_plano"]["valor_oferta"])[1]);
    modal_antifulga.find('.dados_detalhe').html(trata_preco_api(plano["info_plano"]["dados_detalhe"]));
    modal_antifulga.find('.is-ligacoes-txt').html(trata_preco_api(plano["info_plano"]["titulo"]));

     if (plano["info_plano"]["apps"] != null) {
        modal_antifulga.find(".social-content").empty();
        for (var i = 0; i < plano["info_plano"]["apps"]["imagens"].length; i++) {
            modal_antifulga.find(".social-content").append('<img src="https://automatuslab.blob.core.windows.net/vivofluxoonline/'+plano["info_plano"]["apps_large"]["imagens"][i]+'" class="social-antifulga">');
        }

     }

    modal_antifulga.find(".abre_loja").attr("data-preco", plano["valores_plano"]["valor_oferta"]);
    modal_antifulga.find(".abre_loja").attr("data-ddd", ddd);
    modal_antifulga.find(".abre_loja").attr("data-uf", uf);
    modal_antifulga.find(".abre_loja").attr("data-sku", plano["sku"]);
    modal_antifulga.find(".abre_loja").attr("data-nome", plano["info_plano"]["dados"]);

    modal_antifulga.children().attr('data-sku', plano["sku"]);
}

function popula_cards(planos, classe, uf, cidade, ddd, tipo) {
    let wrap_box_planos;
    if ($(window).width() > 990) {
        wrap_box_planos = $('.wrap.box-planos.'+tipo).children();
        if (planos.length > 2) {
            planos.move(0, 1);
        }
    } else {
        wrap_box_planos = $(".c_slide_produtos."+tipo).find(".mask-slide").children();
    }

    i = 0;
    $(wrap_box_planos).each(function(index, el) {
        i++;
        // console.log($(this));
        // console.log("sku: "+planos[index]["sku"]+" dados: "+planos[index]["info_plano"]["dados"].replace("GB", ''));

        $(this).find('.'+ classe).find('.box-titulo .box-titulo-destaque').empty().html(planos[index]["info_plano"]["dados"].replace("GB", ''));
        $(this).find('.'+ classe).find('.box-preco-valor-destaque').html(trata_preco_api(planos[index]["valores_plano"]["valor_oferta"])[0]);
        $(this).find('.'+ classe).find('.box-preco-centavos-destaque').html("," + trata_preco_api(planos[index]["valores_plano"]["valor_oferta"])[1] + "<br>");
        $(this).find('.'+ classe).find('.bonus_txt').html(planos[index]["info_plano"]["dados_detalhe"]);
        if (planos[index]["info_plano"]["apps_add"] != null) {
            $(this).find('.txt_velocidade').html(planos[index]["info_plano"]["apps_add"]["titulo"]);
        }


        if (planos[index]["info_plano"]["apps"] != null) {
            $(".wrap.c_box_icons").empty();
            for (var i = 0; i < planos[index]["info_plano"]["apps"]["imagens"].length; i++) {
                $(".wrap.c_box_icons").append('<img src="https://automatuslab.blob.core.windows.net/vivofluxoonline/'+planos[index]["info_plano"]["apps"]["imagens"][i]+'" class="c_icon_box">');
            }
        }



        var box_topicos_ver_mais = $(this).find('.'+ classe).find(".wrap.box-topicos.ver_mais.none").last();
        var detalhes_lista = $(this).find($(".box-c").find(".beneficios_dinamicos"));
        detalhes_lista.find(".ver_mais").remove();
        // console.log($(this));

        for (var d = 0; d < planos[index]["info_plano"]["detalhe"].length; d++) {
            if (d == 1) {
                continue;
            }

            $(this).find(detalhes_lista).append('<div class="wrap box-topicos ver_mais none"><div class="set c_ontop"><img src="https://uploads-ssl.webflow.com/5babd501fb0eee25943c30a1/5ce58cbd98314d97a5f11baa_check.png" alt="Modem Grátis" class="box-topico-icon c_menor"></div><div class="set apps_box"><div class="box-topico-txt">' + "<span class='bold'>" + planos[index]["info_plano"]["detalhe"][d].replace(/ .*/, '') + "</span><br><span class='topico_subtext'>" + planos[index]["info_plano"]["detalhe"][d].replace(planos[index]["info_plano"]["detalhe"][d].replace(/ .*/, ''), '') + '</span></div></div></div>');
        }
        $(this).find('.'+ classe).find("a.abre_loja").attr("data-preco", planos[index]["valores_plano"]["valor_oferta"]);
        $(this).find('.'+ classe).find("a.abre_loja").attr("data-ddd", ddd);
        $(this).find('.'+ classe).find("a.abre_loja").attr("data-uf", uf);
        $(this).find('.'+ classe).find("a.abre_loja").attr("data-sku", planos[index]["sku"]);
        $(this).find('.'+ classe).find("a.abre_loja").attr("data-nome", planos[index]["info_plano"]["dados"]);
        $(this).parent().attr('data-sku', planos[index]["sku"]);
    });
}
var get_precos = function(ddd, uf, cidade) {
    var ddd = ddd ? ddd : null;
    var uf = uf ? uf : null;
    var cidade = cidade ? cidade : null;

    var serializeDados = {
        "uf": uf,
        "cidade": cidade,
        "ddd": ddd
    };
    var btn = $(".form-ddd-btn");
    console.log(serializeDados);
    $.ajax({
        url: 'https://catalogo-vivo.automatuslab.com/api/Catalogo/DisponibilidadeMovel',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        type: 'POST',
        data: JSON.stringify(serializeDados),
        beforeSend: function() {
            btn.val("Aguarde...");
        },
        success: function(data, textStatus) {
            console.log(data);

            var ddd = data.ddd == null ? ddd : data.ddd;
            // var cidade = data.cidade == null ? cidade : data.cidade;
            // var uf = data.uf == null ? uf : data.uf;

            console.log("ddd: "+ddd+" | data.ddd: "+data.ddd);
            // console.log("cidade: "+cidade+" | data.cidade: "+data.cidade);
            // console.log("uf: "+uf+" | data.uf: "+data.uf);

            if (ddd == '81' || ddd == '87') {
                for (var i = 0; i < data.portfolio.controle.length; i++) {

                    if(data.portfolio.controle[i].sku == 'CTRL009DE') {
                        let oferta_antifulga =  data.portfolio.controle[i];
                        console.log(oferta_antifulga);
                        popula_modal_antifulga(oferta_antifulga, ddd, uf);
                    }
                }
            } else {
                for (var i = 0; i < data.portfolio.controle.length; i++) {

                    if(data.portfolio.controle[i].sku == 'CTRL009DN') {
                        let oferta_antifulga =  data.portfolio.controle[i];
                        console.log(oferta_antifulga);
                        popula_modal_antifulga(oferta_antifulga, ddd, uf);
                    }
                }
            }


            // MENSAL
            var planos = [];
            cont = 0;
            var planos_promo = [];
            cont_promo = 0;

            // ANUAL
            var planos_anual = [];
            cont_anual = 0;
            var planos_promo_anual = [];
            cont_promo_anual = 0;

            for (var i = 0; i < data.portfolio.controle.length; i++) {

                // MENSAL 
                if (data.portfolio.controle[i]["info_plano"]["tipo_fatura"] == "Digital" && data.portfolio.controle[i]["info_plano"]["view"] == "TRUE" && data.portfolio.controle[i]["info_plano"]["campanha"] == "default" && data.portfolio.controle[i]["info_plano"]["anual"] == "FALSE") {
                    planos[cont] = data.portfolio.controle[i];
                    cont++;
                }
                if (data.portfolio.controle[i]["info_plano"]["tipo_fatura"] == "Digital" && data.portfolio.controle[i]["info_plano"]["view"] == "FALSE" && data.portfolio.controle[i]["info_plano"]["campanha"] == "promo-app" && data.portfolio.controle[i]["info_plano"]["anual"] == "FALSE") {
                    planos_promo[cont_promo] = data.portfolio.controle[i];
                    cont_promo++;
                }

                // ANUAL
                if (data.portfolio.controle[i]["info_plano"]["tipo_fatura"] == "Digital" && data.portfolio.controle[i]["info_plano"]["view"] == "TRUE" && data.portfolio.controle[i]["info_plano"]["campanha"] == "default" && data.portfolio.controle[i]["info_plano"]["anual"] == "TRUE") {
                    planos_anual[cont_anual] = data.portfolio.controle[i];
                    cont_anual++;
                }
                if (data.portfolio.controle[i]["info_plano"]["tipo_fatura"] == "Digital" && data.portfolio.controle[i]["info_plano"]["view"] == "FALSE" && data.portfolio.controle[i]["info_plano"]["campanha"] == "promo-app" && data.portfolio.controle[i]["info_plano"]["anual"] == "TRUE") {
                    planos_promo_anual[cont_promo_anual] = data.portfolio.controle[i];
                    cont_promo_anual++;
                }
            }

            console.log("Qtd de produtos | MENSAL - DEFAULT: "+cont);
            console.log("Qtd de produtos | MENSAL - PROMO: "+cont_promo);
            console.log("Qtd de produtos | ANUAL - DEFAULT: "+cont_anual);
            console.log("Qtd de produtos | ANUAL - PROMO: "+cont_promo_anual);

            popula_cards(planos, 'sem_promocao', uf, cidade, ddd, "plano_mensal");
            popula_cards(planos_promo, 'com_promocao', uf, cidade, ddd, "plano_mensal");

            popula_cards(planos_anual, 'sem_promocao', uf, cidade, ddd, "plano_anual");
            popula_cards(planos_promo_anual, 'com_promocao', uf, cidade, ddd, "plano_anual");

            if (data.portfolio.controle.length > 0) {
                $(".modal-ddd").css('display', 'none');
                $(".area-boxes").removeClass('blur');
                document.cookie = "uf = " + uf + "; path=/";
                document.cookie = "ddd = " + ddd + "; path=/";
                document.cookie = "cidade = " + cidade + "; path=/";
                $(".place-uf").html(`${uf} (${ddd})`);
            }
        },
        error: function(xhr, er) {
            console.log('Error ' + xhr.status + ' - ' + xhr.statusText + ' - Tipo de erro: ' + er);
        },
        complete: function() {
            btn.val("Continuar");
            if ($(window).width() > 990) {
                var wrap_box_planos = $(".wrap.box-planos").children();
            } else {
                var wrap_box_planos = $(".c_slide_produtos").children().children().children();
            }

            

            $('.velocidade-destaque').html(wrap_box_planos.find(".box-c.key").find(".box-titulo-destaque").html());
            $(".c_texto.c_preco").empty().html(wrap_box_planos.find(".box-c.key").find('.box-preco-valor-destaque').html());
            $(".c_texto.c_centavos").empty().html(wrap_box_planos.find(".box-c.key").find('.box-preco-centavos-destaque').html());
            var destaque_btn = wrap_box_planos.find(".box-c.key").find(".abre_loja");

            var ddd = destaque_btn.attr("data-ddd");
            $("a.c_btn.c_shadow.menor.amarelo.abre_loja.cta.w-button").attr("data-preco", destaque_btn.attr("data-preco")).attr("data-ddd", destaque_btn.attr("data-ddd")).attr("data-uf", destaque_btn.attr("data-uf")).attr("data-sku", destaque_btn.attr("data-sku")).attr('data-nome', destaque_btn.attr("data-nome"));
            $("a.c_btn.c_shadow.menor.amarelo.abre_loja.no-shadow.w-button").attr("data-preco", destaque_btn.attr("data-preco")).attr("data-ddd", destaque_btn.attr("data-ddd")).attr("data-uf", destaque_btn.attr("data-uf")).attr("data-sku", destaque_btn.attr("data-sku")).attr('data-nome', destaque_btn.attr("data-nome"));


            if (ddd == '81' || ddd == '87') {
                $(".wrap.box-topicos.last.toggle_last").css('display', 'none');
                $(".wrap.box-topicos.last.toggle_last").prev().addClass('new_toggle_last');

                $(".show_only_81_87").removeClass('hide');
                $(".show_to_all").addClass('hide');

            } else {
                $(".wrap.box-topicos.last.toggle_last").css('display', 'flex');
                $(".wrap.box-topicos.last.toggle_last").prev().removeClass('new_toggle_last');

                $(".show_only_81_87").addClass('hide');
                $(".show_to_all").removeClass('hide');
            }
        }
    });
}
$.fn.extend({
    toggleText: function(a, b) {
        return this.text(this.text() == b ? a : b);
    }
});
$('.link-anual_mensal').on('click', function() {
    $(".link-anual_mensal").toggleClass('selecionado');
    $('.plano_mensal').toggleClass('none');
    $('.plano_anual').toggleClass('none');
    $('.c_bolhabox.a').toggleClass('anual');
    $('.c_bolhabox.b').toggleClass('anual');
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

    if( $(".wrap.box-topicos").hasClass('new_toggle_last') ) {
        $(".wrap.box-topicos.new_toggle_last").toggleClass('last');
    }

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
$(document).on('click', '.fechar-modal-ddd', function(event) {
    if (checa_cookie_ddd() == false) {
        get_precos(21, 'RJ', null);
    }
});
$(document).on('click', '.ghost_ddd', function(event) {
    $('.modal-ddd.in_c').css('display', 'none');
    if (checa_cookie_ddd() == false) {
        get_precos(21, 'RJ', null);
    }
});


// modal antifulga
$(document).on('click', '.close-modal-antifulga, .ghost-fechar, .btn-antifulga', fechar_antifulga);

addEvent(document, "mouseout", function(event) {
    event = event ? event : window.event;
    var from = event.relatedTarget || event.toElement;
    if ( (!from || from.nodeName == "HTML") && event.clientY <= 100 && first_time ) {
        abrir_antifulga();
    }
});


Webflow.push(function() {
    onInactive(30000, function () {
        abrir_antifulga();
    });

    $(".escolha-estado").append(ufs);

    $('.escolha-estado option[value=RJ]').attr('selected','selected');

    change_ufs(ddds, 'RJ');

    checa_cookie_ddd();

    $('.plano_mensal').addClass('none');
    $('.com_promocao').addClass('none');

    if('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(displayLocationInfo, getErrorGeoLocation);
    }

});
