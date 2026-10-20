// ---------- Núcleo: protocolo de tratamento de superfície por material restaurador ----------
// Valores baseados em protocolos descritos na literatura e em instruções de fabricantes comuns.
// Conferir sempre a instrução de uso do produto em mãos.
var MATERIALS = [
  { id: 'fels', nome: 'Porcelana feldspática', ex: 'Vita Mark II, porcelana estratificada sobre refratário', fam: 'vitro',
    hf: { 5: 90, 10: 60 }, silano: true, ultra: true,
    evitar: ['Condicionar além do tempo: o excesso de ácido deixa a superfície com microfissuras e enfraquece a lente fina.'] },
  { id: 'leu', nome: 'Vitrocerâmica reforçada por leucita', ex: 'IPS Empress Esthetic, IPS Empress CAD', fam: 'vitro',
    hf: { 5: 60, 10: 60 }, silano: true, ultra: true,
    evitar: ['Condicionar além do tempo indicado pelo fabricante.'] },
  { id: 'dis', nome: 'Dissilicato de lítio', ex: 'IPS e.max Press, IPS e.max CAD', fam: 'vitro',
    hf: { 5: 20, 10: 20 }, silano: true, ultra: false,
    evitar: ['Passar de 20 s: o dissilicato é condicionado por menos tempo que as feldspáticas e o excesso fragiliza a superfície.', 'Ácido fosfórico não substitui o fluorídrico nesta cerâmica.'] },
  { id: 'zls', nome: 'Silicato de lítio reforçado com zircônia', ex: 'Celtra Duo, Suprinity', fam: 'vitro',
    hf: { 5: 30, 10: 30 }, silano: true, ultra: false,
    evitar: ['Trocar o tempo sem ler a instrução do fabricante: varia entre produtos.'] },
  { id: 'pic', nome: 'Cerâmica infiltrada por polímero', ex: 'Vita Enamic', fam: 'hibrido',
    hf: { 5: 60, 10: 60 }, silano: true, ultra: false,
    evitar: ['Jatear em alta pressão: a fase polimérica é mais frágil que a cerâmica.'] },
  { id: 'res', nome: 'Resina CAD/CAM e resina indireta', ex: 'Lava Ultimate, Cerasmart, Brilliant Crios', fam: 'resina',
    hf: null, abr: { tam: '50 µm (óxido de alumínio)', mpa: '0,1 a 0,2', seg: 10 }, silano: true, ultra: false,
    evitar: ['Ácido fluorídrico: não é o método indicado para estes materiais, e a resina não responde como uma vitrocerâmica.'] },
  { id: 'zir', nome: 'Zircônia (Y-TZP)', ex: 'Zircônia monolítica translúcida, infraestrutura de zircônia', fam: 'zirconia',
    hf: null, abr: { tam: '50 µm (óxido de alumínio)', mpa: '0,1 a 0,25', seg: 10 }, silano: false, mdp: true, ultra: false,
    evitar: ['Ácido fluorídrico: não condiciona a zircônia e é só risco.', 'Silano sozinho: não cria união durável com a zircônia. Use primer com MDP.', 'Jateamento forte demais: pode gerar trincas na zircônia.'] }
];
var SUBSTRATES = [
  { id: 'esm', nome: 'Esmalte' },
  { id: 'mis', nome: 'Esmalte com áreas de dentina exposta' },
  { id: 'den', nome: 'Predominantemente dentina' }
];
var CEMENTS = [
  { id: 'foto', nome: 'Cimento resinoso fotopolimerizável' },
  { id: 'dual', nome: 'Cimento resinoso dual' }
];
function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
function fmtSec(s) { return s >= 60 && s % 60 === 0 ? (s / 60) + ' min' : s + ' s'; }

// opts: { mat, conc (5|10), contaminada (bool), sub, cim }
function buildProtocol(o) {
  var m = byId(MATERIALS, o.mat), sub = byId(SUBSTRATES, o.sub), cim = byId(CEMENTS, o.cim);
  if (!m || !sub || !cim) return null;
  var conc = o.conc === 10 ? 10 : 5;
  var piece = [], tooth = [], cement = [], warns = [];
  if (o.contaminada) {
    if (m.fam === 'zirconia') piece.push({ t: 'Limpar a peça contaminada na prova (saliva, pasta de prova): limpador alcalino à base de zircônia por cerca de 20 s, lavar e secar. Se a contaminação for forte, repetir o jateamento.', s: 20 });
    else if (m.fam === 'resina') piece.push({ t: 'Limpar a peça contaminada: lavar com água, secar e, se preciso, repetir o jateamento leve antes do silano.', s: null });
    else piece.push({ t: 'Limpar a peça contaminada na prova (saliva, pasta de prova): ácido fosfórico a 37% por 20 a 60 s, ou limpador alcalino por cerca de 20 s, conforme o fabricante. Lavar e secar. Não condicionar de novo com ácido fluorídrico só por causa da contaminação.', s: null });
  }
  if (m.hf) {
    var sec = m.hf[conc];
    piece.push({ t: 'Condicionar a face interna da peça com ácido fluorídrico a ' + conc + '%, só fora da boca, por ' + fmtSec(sec) + '.', s: sec, hf: true });
    piece.push({ t: 'Lavar com spray de água por 60 s, de preferência após neutralizar o ácido, e secar com ar livre de óleo. A superfície deve ficar fosca e esbranquiçada.', s: 60 });
    if (m.ultra) piece.push({ t: 'Banho em ultrassom com água ou álcool por 5 min para soltar resíduos do condicionamento.', s: 300, opt: true });
  } else if (m.abr) {
    piece.push({ t: 'Jatear a face interna com partículas de ' + m.abr.tam + ', pressão de ' + m.abr.mpa + ' MPa, ponta a cerca de 10 mm, por cerca de ' + m.abr.seg + ' s, em movimentos contínuos.', s: m.abr.seg });
    piece.push({ t: 'Remover os resíduos com jato de ar e, se quiser, ultrassom em álcool por 3 min. Secar.', s: null });
  }
  if (m.silano) piece.push({ t: 'Aplicar silano na face interna, aguardar 60 s e secar com jato de ar suave (ar morno acelera a evaporação do solvente).', s: 60 });
  if (m.mdp) piece.push({ t: 'Aplicar o primer para zircônia com MDP em camada fina, aguardar o tempo do fabricante e secar suavemente. Se o cimento já contém MDP, siga a instrução dele sobre ainda usar o primer.', s: null });
  piece.push({ t: 'Manter a peça protegida de luz e de contaminação até o assentamento.', s: null });

  tooth.push({ t: 'Profilaxia do dente com pasta sem flúor e sem óleo, lavar e secar. Isolamento do campo conforme a técnica.', s: null });
  if (sub.id === 'esm') tooth.push({ t: 'Condicionar o esmalte com ácido fosfórico a 35 a 37% por 30 s.', s: 30 });
  else if (sub.id === 'mis') {
    tooth.push({ t: 'Condicionar o esmalte com ácido fosfórico a 35 a 37% por 15 s.', s: 15 });
    tooth.push({ t: 'Estender o ácido à dentina por mais 15 s (esmalte 30 s no total, dentina 15 s).', s: 15 });
  } else tooth.push({ t: 'Condicionar a dentina com ácido fosfórico a 35 a 37% por 15 s, sem passar do tempo.', s: 15 });
  tooth.push({ t: 'Lavar por 30 s e secar sem ressecar a dentina (superfície brilhante, sem poças).', s: 30 });
  tooth.push({ t: 'Aplicar o adesivo conforme o fabricante, friccionando, e volatilizar o solvente. Camada fina: adesivo grosso impede o assentamento completo. Fotopolimerizar o adesivo no dente apenas se o fabricante do cimento indicar.', s: null });
  if (sub.id !== 'esm') warns.push('Dentina exposta: se o preparo foi selado logo depois de feito (selamento imediato da dentina), limpe a camada selada antes de cimentar, como orienta o seu protocolo.');

  cement.push({ t: 'Aplicar o cimento na peça, assentar com pressão leve e remover os excessos' + (cim.id === 'foto' ? ' antes de polimerizar.' : ' antes de polimerizar ou conforme o tempo de presa do cimento dual.'), s: null });
  cement.push({ t: 'Aplicar gel de glicerina nas margens e fotopolimerizar por todas as faces, com o tempo e a potência do fabricante do cimento e do aparelho. Em lentes finas a luz atravessa bem, mas o tempo curto compromete a conversão.', s: null });
  cement.push({ t: 'Remover o gel, conferir margens e oclusão, acabar e polir.', s: null });

  if (m.hf) warns.push('Ácido fluorídrico é tóxico e corrosivo. Use só fora da boca, com luvas, óculos e pó ou líquido neutralizador à mão, e descarte conforme a orientação do fabricante.');
  m.evitar.forEach(function (e) { warns.push(e); });
  warns.push('Tempos e pressões são valores usuais da literatura e de instruções de fabricantes. A instrução do produto em uso prevalece.');
  var total = 0; [piece, tooth, cement].forEach(function (g) { g.forEach(function (st) { if (st.s && !st.opt) total += st.s; }); });
  return { material: m, substrate: sub, cement: cim, conc: conc, groups: [{ nome: 'Peça (face interna)', steps: piece }, { nome: 'Dente', steps: tooth }, { nome: 'Cimentação', steps: cement }], warns: warns, totalSec: total };
}
function compareRows() {
  return MATERIALS.map(function (m) {
    var cond = m.hf ? ('HF ' + (m.hf[5] === m.hf[10] ? '5 a 10% por ' + fmtSec(m.hf[5]) : '5% por ' + fmtSec(m.hf[5]) + ' ou 10% por ' + fmtSec(m.hf[10]))) : ('Jateamento ' + m.abr.mpa + ' MPa');
    return { id: m.id, nome: m.nome, cond: cond, uniao: m.mdp ? 'Primer com MDP' : 'Silano' };
  });
}
function summaryText(p) {
  var L = [p.material.nome + ' | ' + p.substrate.nome + ' | ' + p.cement.nome];
  p.groups.forEach(function (g) { L.push(''); L.push(g.nome + ':'); g.steps.forEach(function (s, i) { L.push((i + 1) + '. ' + s.t); }); });
  L.push(''); L.push('Avisos:'); p.warns.forEach(function (w) { L.push('- ' + w); });
  L.push(''); L.push('Ferramenta de estudo. A instrução do fabricante prevalece.');
  return L.join('\n');
}
