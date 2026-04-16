(function () {
  "use strict";

  var ACCESS_KEY = "6c7af2e0-6fa1-4a50-8bf2-343af4e6b2ef";

  var QUESTIONS = [
    { type: "intro" },
    {
      type: "input",
      name: "nombre",
      q: "\u00bfC\u00f3mo se llama?",
      placeholder: "Su nombre completo",
      required: true,
    },
    {
      type: "email",
      name: "email",
      q: "\u00bfCu\u00e1l es su correo electr\u00f3nico?",
      placeholder: "correo@ejemplo.com",
      required: true,
    },
    {
      type: "input",
      name: "empresa_nombre",
      q: "\u00bfCu\u00e1l es el nombre de su empresa?",
      placeholder: "Nombre de la empresa",
    },

    { type: "section", title: "Sobre la Empresa", num: "01" },
    {
      type: "textarea",
      name: "empresa_situacion",
      q: "Situaci\u00f3n actual de la empresa. \u00bfQu\u00e9 es y a qu\u00e9 se dedica?",
    },
    {
      type: "textarea",
      name: "empresa_servicios",
      q: "Descripci\u00f3n de los servicios o productos de la empresa.",
    },
    {
      type: "textarea",
      name: "empresa_resultados",
      q: "\u00bfQu\u00e9 resultados empresariales se est\u00e1 buscando?",
    },
    {
      type: "textarea",
      name: "empresa_valores",
      q: "\u00bfCu\u00e1les son los valores que busca representar su empresa?",
    },
    {
      type: "textarea",
      name: "logo_problema",
      q: "\u00bfCu\u00e1l es el principal problema que quiere resolver con el redise\u00f1o de su logotipo?",
      hint: "Si ser\u00e1 nuevo, \u00bfcu\u00e1l es su prop\u00f3sito principal?",
    },
    {
      type: "textarea",
      name: "logos_referencia",
      q: "Mencione algunos logos que le agraden visualmente y explique por qu\u00e9.",
    },
    {
      type: "textarea",
      name: "competidores",
      q: "Mencione dos o tres de sus competidores.",
      hint: "Mencione los puntos fuertes y d\u00e9biles de su imagen.",
    },

    { type: "section", title: "Su Audiencia", num: "02" },
    {
      type: "textarea",
      name: "audiencia_target",
      q: "\u00bfA qui\u00e9n se dirigen sus productos o servicios?",
      hint: "G\u00e9nero, edad, geograf\u00eda, prioridades, ocupaciones y estado socioecon\u00f3mico.",
    },
    {
      type: "textarea",
      name: "audiencia_perfil",
      q: "Describa el perfil general de sus clientes.",
    },
    {
      type: "textarea",
      name: "audiencia_percepcion",
      q: "\u00bfC\u00f3mo le gustar\u00eda que sus clientes describieran su marca e imagen?",
    },

    { type: "section", title: "Acerca de la Marca", num: "03" },
    {
      type: "textarea",
      name: "marca_sensaciones",
      q: "Describa las sensaciones y atributos que quiera comunicar por medio de su logotipo.",
      hint: "Ejemplos \u2014 sensaciones: amistad, seguridad, entusiasmo. Atributos: profesionalismo, elegancia, confiabilidad.",
    },
    {
      type: "input",
      name: "marca_adjetivos",
      q: "\u00bfC\u00f3mo quiere que se vea el logotipo?",
      placeholder: "Ej: Juvenil, cl\u00e1sico, moderno, elegante\u2026",
      hint: "Use adjetivos y frases cortas.",
    },
    {
      type: "textarea",
      name: "marca_iconos",
      q: "\u00bfTiene im\u00e1genes o iconos espec\u00edficos en mente para su logo?",
    },
    {
      type: "input",
      name: "colores_incorporar",
      q: "\u00bfAlg\u00fan color que le gustar\u00eda incorporar?",
      placeholder: "Ej: Azul marino, dorado\u2026",
      hint: "Colores deseados o institucionales de su empresa.",
    },
    {
      type: "input",
      name: "colores_evitar",
      q: "\u00bfColores a evitar?",
      placeholder: "Ej: Rosa, verde ne\u00f3n\u2026",
    },
    {
      type: "input",
      name: "timeline",
      q: "\u00bfTiene una fecha l\u00edmite o margen de tiempo?",
      placeholder: "Ej: Para finales de mayo, sin prisa\u2026",
    },
    {
      type: "textarea",
      name: "preocupaciones",
      q: "\u00bfQu\u00e9 le preocupa sobre el proyecto?",
      hint: "\u00bfQu\u00e9 se imagina que pueda ir mal?",
    },
    {
      type: "textarea",
      name: "proyecto_contexto",
      q: "\u00bfHay algo de su empresa que pueda hacer este proyecto m\u00e1s f\u00e1cil o m\u00e1s dif\u00edcil?",
    },

    { type: "section", title: "Ejecuci\u00f3n y Consideraciones", num: "04" },
    {
      type: "rating",
      name: "importancia",
      q: "\u00bfQu\u00e9 tan importante es cada opci\u00f3n para usted?",
      items: [
        {
          key: "imagen",
          label: "Redise\u00f1o / Nueva imagen / Impacto visual",
        },
        {
          key: "rapidez",
          label: "Que se haga lo m\u00e1s r\u00e1pido posible",
        },
        { key: "costo", label: "Que se haga lo m\u00e1s barato posible" },
        {
          key: "diferenciacion",
          label: "Diferenciaci\u00f3n de la competencia",
        },
        { key: "nueva_audiencia", label: "Llegar a nueva audiencia" },
        { key: "valores", label: "Demostrar los valores de la empresa" },
      ],
    },
    {
      type: "textarea",
      name: "vision_exito",
      q: "\u00bfC\u00f3mo ser\u00eda su visi\u00f3n de \u00e9xito de este proyecto?",
    },
    {
      type: "textarea",
      name: "presupuesto",
      q: "Presupuesto para este proyecto.",
      hint: "Esto me ayudar\u00e1 a hacer una propuesta apropiada. No es obligatorio.",
    },
    {
      type: "textarea",
      name: "observaciones",
      q: "Observaciones y comentarios adicionales.",
    },
  ];

  var RATING_LEVELS = [
    "No prioritario",
    "Algo importante",
    "Importante",
    "Muy importante",
  ];

  // ── Helpers ──

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs)
      Object.keys(attrs).forEach(function (k) {
        if (k === "className") node.className = attrs[k];
        else if (k === "html") node.innerHTML = attrs[k];
        else if (k === "text") node.textContent = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    if (children)
      children.forEach(function (c) {
        if (c) node.appendChild(c);
      });
    return node;
  }

  function autoGrow(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }

  // ── Build Slides ──

  function numberQuestions() {
    var n = 0;
    QUESTIONS.forEach(function (q) {
      if (q.type !== "intro" && q.type !== "section") {
        n++;
        q._num = n;
      }
    });
    return n;
  }

  var totalQuestions = numberQuestions();

  function buildActions(isLast, label) {
    var wrap = el("div", { className: "q-actions" });
    var btn = el("button", {
      className: "q-btn" + (isLast ? " q-btn--submit" : ""),
      type: "button",
      "data-action": isLast ? "submit" : "next",
      html:
        (label || (isLast ? "Enviar respuestas" : "Continuar")) +
        ' <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 5L12.5 10L7.5 15"/></svg>',
    });
    wrap.appendChild(btn);

    var hint = el("span", { className: "q-key-hint" });
    hint.innerHTML = "presione <kbd>Enter</kbd>";
    wrap.appendChild(hint);
    return wrap;
  }

  function buildIntro() {
    var content = el("div", { className: "q-content" });
    content.appendChild(
      el("h1", {
        className: "q-intro__title",
        text: "Cuestionario de Dise\u00f1o de Logo",
      }),
    );
    content.appendChild(
      el("p", {
        className: "q-intro__subtitle",
        text: "Cada proyecto es diferente. Estas preguntas me ayudar\u00e1n a entender sus necesidades y crear una propuesta adecuada.",
      }),
    );
    content.appendChild(
      el("p", {
        className: "q-intro__note",
        text: "Si alguna pregunta no es relevante, puede omitirla.",
      }),
    );
    content.appendChild(buildActions(false, "Comenzar"));
    return content;
  }

  function buildSection(q) {
    var content = el("div", { className: "q-content" });
    content.appendChild(
      el("p", { className: "q-section__num", text: "Secci\u00f3n " + q.num }),
    );
    content.appendChild(
      el("h2", { className: "q-section__title", text: q.title }),
    );
    content.appendChild(buildActions(false));
    return content;
  }

  function buildInput(q, isLast) {
    var content = el("div", { className: "q-content" });
    content.appendChild(
      el("p", {
        className: "q-number",
        html:
          q._num +
          ' <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 5L12.5 10L7.5 15"/></svg>',
      }),
    );
    content.appendChild(el("h2", { className: "q-question", text: q.q }));
    if (q.hint)
      content.appendChild(el("p", { className: "q-hint", text: q.hint }));
    var field = el("div", { className: "q-field" });
    var input = el("input", {
      className: "q-input",
      type: q.type === "email" ? "email" : "text",
      name: q.name,
      placeholder: q.placeholder || "",
      autocomplete:
        q.type === "email" ? "email" : q.name === "nombre" ? "name" : "off",
    });
    if (q.required) input.setAttribute("required", "");
    field.appendChild(input);
    content.appendChild(field);
    content.appendChild(buildActions(isLast));
    return content;
  }

  function buildTextarea(q, isLast) {
    var content = el("div", { className: "q-content" });
    content.appendChild(
      el("p", {
        className: "q-number",
        html:
          q._num +
          ' <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 5L12.5 10L7.5 15"/></svg>',
      }),
    );
    content.appendChild(el("h2", { className: "q-question", text: q.q }));
    if (q.hint)
      content.appendChild(el("p", { className: "q-hint", text: q.hint }));
    var field = el("div", { className: "q-field" });
    var ta = el("textarea", {
      className: "q-textarea",
      name: q.name,
      rows: "1",
      placeholder: q.placeholder || "",
    });
    ta.addEventListener("input", function () {
      autoGrow(ta);
    });
    field.appendChild(ta);
    content.appendChild(field);
    var actions = buildActions(isLast);
    var hint = actions.querySelector(".q-key-hint");
    if (hint) hint.innerHTML = "<kbd>Ctrl</kbd>+<kbd>Enter</kbd>";
    content.appendChild(actions);
    return content;
  }

  function buildRating(q, isLast) {
    var content = el("div", { className: "q-content" });
    content.appendChild(
      el("p", {
        className: "q-number",
        html:
          q._num +
          ' <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 5L12.5 10L7.5 15"/></svg>',
      }),
    );
    content.appendChild(el("h2", { className: "q-question", text: q.q }));
    var list = el("div", { className: "q-rating-list" });

    q.items.forEach(function (item) {
      var row = el("div", { className: "q-rating-item" });
      row.appendChild(
        el("p", { className: "q-rating-label", text: item.label }),
      );
      var opts = el("div", { className: "q-rating-options" });
      RATING_LEVELS.forEach(function (level) {
        var btn = el("button", {
          className: "q-rating-btn",
          type: "button",
          text: level,
          "data-name": "importancia_" + item.key,
          "data-value": level,
        });
        btn.addEventListener("click", function () {
          opts.querySelectorAll(".q-rating-btn").forEach(function (b) {
            b.classList.remove("is-selected");
          });
          btn.classList.add("is-selected");
        });
        opts.appendChild(btn);
      });
      row.appendChild(opts);
      list.appendChild(row);
    });

    content.appendChild(list);
    content.appendChild(buildActions(isLast));
    return content;
  }

  // ── Questionnaire Controller ──

  function init() {
    var container = document.getElementById("slides");
    var progressFill = document.getElementById("progressFill");
    var backBtn = document.getElementById("backBtn");
    var counterEl = document.getElementById("counter");
    var current = 0;
    var animating = false;
    var slides = [];

    // Build all slides
    QUESTIONS.forEach(function (q, i) {
      var isLast = false;
      // Check if this is the last answerable question
      for (var j = QUESTIONS.length - 1; j >= 0; j--) {
        if (QUESTIONS[j].type !== "section" && QUESTIONS[j].type !== "intro") {
          if (j === i) isLast = true;
          break;
        }
      }

      var slide = el("div", {
        className: "q-slide" + (q.type === "rating" ? " q-slide--long" : ""),
      });
      var content;
      switch (q.type) {
        case "intro":
          content = buildIntro();
          break;
        case "section":
          content = buildSection(q);
          break;
        case "input":
        case "email":
          content = buildInput(q, isLast);
          break;
        case "textarea":
          content = buildTextarea(q, isLast);
          break;
        case "rating":
          content = buildRating(q, isLast);
          break;
      }
      slide.appendChild(content);
      container.appendChild(slide);
      slides.push(slide);
    });

    // Show first
    slides[0].classList.add("is-active");
    updateUI();

    function updateUI() {
      var q = QUESTIONS[current];
      var isQuestion = q.type !== "intro" && q.type !== "section";

      // Progress
      var progress = 0;
      if (isQuestion) {
        progress = (q._num / totalQuestions) * 100;
      } else if (q.type === "section") {
        // Find next question's number for progress
        for (var i = current + 1; i < QUESTIONS.length; i++) {
          if (QUESTIONS[i]._num) {
            progress = ((QUESTIONS[i]._num - 1) / totalQuestions) * 100;
            break;
          }
        }
      }
      progressFill.style.width = progress + "%";

      // Counter
      counterEl.textContent = isQuestion ? q._num + " / " + totalQuestions : "";

      // Back button
      backBtn.hidden = current === 0;
    }

    function goTo(index, direction) {
      if (animating || index < 0 || index >= slides.length || index === current)
        return;
      animating = true;

      var from = slides[current];
      var to = slides[index];

      // Set exit direction
      from.classList.remove("is-active");
      from.classList.add(direction === "forward" ? "is-above" : "");

      // Prepare entry
      if (direction === "back") {
        to.classList.add("is-above");
        // Force reflow so the class is applied before removing
        to.offsetHeight; // eslint-disable-line no-unused-expressions
        to.classList.remove("is-above");
      }
      to.classList.add("is-active");

      current = index;
      updateUI();

      // Focus input after transition
      setTimeout(function () {
        from.classList.remove("is-above");
        animating = false;
        var input = to.querySelector("input, textarea");
        if (input) input.focus();
      }, 480);
    }

    function validateCurrent() {
      var q = QUESTIONS[current];
      if (!q.required) return true;
      var input = slides[current].querySelector("input, textarea");
      if (!input) return true;
      var val = input.value.trim();
      if (!val) {
        input.focus();
        // Add a brief shake
        input.style.borderBottomColor = "hsl(3, 80%, 55%)";
        setTimeout(function () {
          input.style.borderBottomColor = "";
        }, 1200);
        return false;
      }
      if (q.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        input.focus();
        input.style.borderBottomColor = "hsl(3, 80%, 55%)";
        var err = slides[current].querySelector(".q-error");
        if (!err) {
          err = el("div", {
            className: "q-error",
            text: "Por favor ingrese un correo v\u00e1lido.",
          });
          input.parentNode.appendChild(err);
        }
        setTimeout(function () {
          input.style.borderBottomColor = "";
          if (err) err.remove();
        }, 2500);
        return false;
      }
      return true;
    }

    function next() {
      if (!validateCurrent()) return;
      if (current < slides.length - 1) goTo(current + 1, "forward");
    }

    function prev() {
      if (current > 0) goTo(current - 1, "back");
    }

    function collectData() {
      var data = {};
      // Inputs and textareas
      container.querySelectorAll("input, textarea").forEach(function (el) {
        if (el.name && el.value.trim()) data[el.name] = el.value.trim();
      });
      // Rating buttons
      container
        .querySelectorAll(".q-rating-btn.is-selected")
        .forEach(function (btn) {
          data[btn.dataset.name] = btn.dataset.value;
        });
      return data;
    }

    function submit() {
      var data = collectData();
      var btn = slides[current].querySelector(".q-btn");
      var origHTML = btn.innerHTML;
      btn.innerHTML = "Enviando\u2026";
      btn.classList.add("q-btn--loading");

      var payload = Object.assign(
        {
          access_key: ACCESS_KEY,
          subject:
            "Cuestionario de Logo \u2014 " +
            (data.empresa_nombre || data.nombre || "Sin nombre"),
          from_name: data.nombre || "An\u00f3nimo",
        },
        data,
      );

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (res) {
          if (res.success) {
            showSuccess();
          } else {
            showError(btn, origHTML);
          }
        })
        .catch(function () {
          showError(btn, origHTML);
        });
    }

    function showSuccess() {
      progressFill.style.width = "100%";
      counterEl.textContent = "";
      backBtn.hidden = true;

      var slide = el("div", { className: "q-slide" });
      var content = el("div", { className: "q-content" });

      var icon = el("div", { className: "q-success__icon" });
      icon.innerHTML =
        '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17L4 12"/></svg>';

      content.appendChild(icon);
      content.appendChild(
        el("h2", { className: "q-success__title", text: "\u00a1Gracias!" }),
      );
      content.appendChild(
        el("p", {
          className: "q-success__text",
          text: "Sus respuestas han sido enviadas. Me pondr\u00e9 en contacto con usted pronto para discutir el proyecto.",
        }),
      );
      content.appendChild(
        el("a", {
          className: "q-btn",
          href: "/",
          html: 'Volver al inicio <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 5L12.5 10L7.5 15"/></svg>',
        }),
      );
      slide.appendChild(content);

      // Fade out current, show success
      slides[current].classList.remove("is-active");
      slides[current].classList.add("is-above");
      container.appendChild(slide);
      requestAnimationFrame(function () {
        slide.classList.add("is-active");
      });
    }

    function showError(btn, origHTML) {
      btn.innerHTML = origHTML;
      btn.classList.remove("q-btn--loading");
      var errEl = slides[current].querySelector(".q-error");
      if (!errEl) {
        errEl = el("div", {
          className: "q-error",
          text: "Hubo un error al enviar. Por favor intente de nuevo.",
        });
        btn.parentNode.appendChild(errEl);
      }
      setTimeout(function () {
        if (errEl) errEl.remove();
      }, 4000);
    }

    // ── Events ──

    // Click handlers (delegated)
    container.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-action]");
      if (!btn) return;
      if (btn.dataset.action === "next") next();
      else if (btn.dataset.action === "submit") submit();
    });

    backBtn.addEventListener("click", function () {
      prev();
    });

    // Keyboard
    document.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        var active = slides[current];
        var ta = active.querySelector("textarea");
        // In textareas, require Ctrl/Cmd+Enter
        if (ta && document.activeElement === ta && !e.ctrlKey && !e.metaKey)
          return;
        e.preventDefault();
        var submitBtn = active.querySelector('[data-action="submit"]');
        if (submitBtn) submit();
        else next();
      }
    });
  }

  // ── Boot ──
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
