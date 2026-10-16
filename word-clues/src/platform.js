/* Граница среды (ТЗ §13.1). P0 живёт на стенде без приложения ВК, поэтому здесь только
   хранилище: localStorage браузера, при его отказе — память вкладки с честным флагом.
   VK Bridge (StorageGet/Set, реклама, обмен) подключается сюда же на P1, остальной код
   о площадке не знает.
   ?nostore — проверка A20: хранилище «ломается», игра должна честно об этом сказать. */
(function (root) {
  'use strict';
  var params = new URLSearchParams(location.search);
  var mem = {};
  var broken = params.has('nostore');

  function lsOk() {
    if (broken) return false;
    try { localStorage.setItem('g1f1.probe', '1'); localStorage.removeItem('g1f1.probe'); return true; }
    catch (e) { return false; }
  }
  var persistent = lsOk();

  var storage = {
    get: function (k) {
      if (persistent) return localStorage.getItem(k);
      return k in mem ? mem[k] : null;
    },
    set: function (k, v) {
      if (broken) throw new Error('storage unavailable');
      if (persistent) localStorage.setItem(k, v);
      else { mem[k] = v; throw new Error('storage not persistent'); }
    },
  };

  root.Platform = {
    name: 'web',
    storage: storage,
    get persistent() { return persistent; },
    params: params,
  };
})(this);
