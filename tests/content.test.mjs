import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import katex from 'katex';
const groups=readdirSync(new URL('../lib/curriculum/',import.meta.url)).filter(f=>f.endsWith('.json')).map(f=>JSON.parse(readFileSync(new URL('../lib/curriculum/'+f,import.meta.url),'utf8')));
const lessons=groups.flat();
test('curriculum has 8 coherent modules and 40 unique reachable lessons',()=>{assert.equal(groups.length,8);assert.equal(lessons.length,40);assert.equal(new Set(lessons.map(l=>l.id)).size,lessons.length);for(const group of groups){assert.equal(new Set(group.map(l=>l.module)).size,1);assert.equal(group.length,5);}});
test('every lesson contains substantive original sections, a valid self-check and secure source links',()=>{for(const l of lessons){assert.match(l.id,/^[a-z0-9-]+$/);assert.ok(l.intuition.join(' ').length>350,l.id);assert.ok(l.steps.length>=3);assert.ok(l.example.steps.length>=3);assert.ok(l.code.includes('print('));assert.ok(l.exercise.length>25);assert.ok(l.solution.length>25);assert.ok(l.quiz.answer>=0&&l.quiz.answer<l.quiz.options.length);assert.ok(l.quiz.explanation.length>30);assert.ok(l.sources.length);for(const source of l.sources)assert.equal(new URL(source.url).protocol,'https:');}});
test('every equation renders without parse failures',()=>{for(const l of lessons)assert.doesNotThrow(()=>katex.renderToString(l.formula,{throwOnError:true,trust:false}),l.id);});
