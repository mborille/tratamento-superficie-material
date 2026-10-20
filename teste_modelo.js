var fs = require('fs'); eval(fs.readFileSync('modelo.js', 'utf8') + ';global.X={MATERIALS,buildProtocol,compareRows,summaryText};');
var Q = global.X, ok = true;
function chk(n, c, d) { console.log((c ? 'OK  ' : 'FAIL') + ' ' + n + (d ? ' ' + d : '')); if (!c) ok = false; }
function txt(p) { return p.groups.map(function (g) { return g.steps.map(function (s) { return s.t; }).join(' | '); }).join(' || '); }
function P(m, c, x, s, ci) { return Q.buildProtocol({ mat: m, conc: c, contaminada: !!x, sub: s || 'esm', cim: ci || 'foto' }); }
var d = P('dis', 5);
chk('dissilicato: HF 5% por 20 s', /ácido fluorídrico a 5%.*20 s/.test(txt(d)));
chk('dissilicato: silano 60 s', /silano.*60 s/.test(txt(d)));
chk('dissilicato 10%: continua 20 s', /a 10%.*20 s/.test(txt(P('dis', 10))));
chk('feldspática: 90 s a 5% e 60 s a 10%', /5%.*90 s/.test(txt(P('fels', 5))) && /10%.*1 min/.test(txt(P('fels', 10))));
var z = P('zir', 5);
chk('zircônia: sem ácido fluorídrico no protocolo', !/ácido fluorídrico a/.test(txt(z)));
chk('zircônia: jateamento e MDP, sem silano na peça', /Jatear/.test(txt(z)) && /MDP/.test(txt(z)) && !/Aplicar silano/.test(txt(z)));
chk('zircônia: avisa para não usar HF', z.warns.some(function (w) { return /fluorídrico/.test(w); }));
var r = P('res', 5);
chk('resina: jateamento e silano, sem HF', /Jatear/.test(txt(r)) && /Aplicar silano/.test(txt(r)) && !/ácido fluorídrico a/.test(txt(r)));
chk('híbrida: HF 5% 60 s', /5%.*1 min/.test(txt(P('pic', 5))));
chk('contaminação adiciona limpeza', txt(P('dis', 5, true)).indexOf('Limpar a peça contaminada') >= 0 && txt(d).indexOf('Limpar a peça contaminada') < 0);
chk('misto: esmalte 15 s + dentina 15 s', /esmalte com ácido fosfórico.*15 s/.test(txt(P('dis', 5, false, 'mis'))) && /dentina por mais 15 s/.test(txt(P('dis', 5, false, 'mis'))));
chk('dentina: 15 s', /dentina com ácido fosfórico.*15 s/.test(txt(P('dis', 5, false, 'den'))));
chk('esmalte: 30 s', /esmalte com ácido fosfórico a 35 a 37% por 30 s/.test(txt(d)));
chk('HF só aparece com aviso de segurança', d.warns[0].indexOf('tóxico') >= 0 && z.warns[0].indexOf('tóxico') < 0);
chk('id inválido devolve null', Q.buildProtocol({ mat: 'x', sub: 'esm', cim: 'foto' }) === null);
chk('total de segundos > 0 e finito', d.totalSec > 100 && isFinite(d.totalSec), d.totalSec);
chk('comparativo cobre os 7 materiais', Q.compareRows().length === 7 && Q.compareRows().every(function (r) { return r.cond && r.uniao; }));
chk('resumo em texto', /Peça/.test(Q.summaryText(d)));
process.exit(ok ? 0 : 1);
