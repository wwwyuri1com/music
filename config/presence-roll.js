/* The same shared roll rules as Studio's Presence preview. */
'use strict';
const PresenceRoll=(()=>{
 function select(moves,dice,round,nextEligible,random=Math.random){
  if(!Number.isInteger(dice)||dice<1||dice>100||!Number.isInteger(round)||round<1)
   throw Error('Presence roll / round must be positive 1–100 and 1+ integers');
  const candidates=moves.filter(m=>dice<=m.chance).sort((a,b)=>a.chance-b.chance);
  let picked=null;
  for(let start=0;start<candidates.length&&!picked;){
   let end=start+1;
   while(end<candidates.length&&candidates[end].chance===candidates[start].chance)end++;
   // Equal-probability actions must not be biased by their stored order.
   // Draw without replacement, checking each candidate's independent cooldown.
   const group=candidates.slice(start,end);
   while(group.length){
    const index=group.length===1?0:Math.floor(random()*group.length);
    const candidate=group.splice(index,1)[0];
    if(round>=(nextEligible[candidate.asset_no]||0)){
     picked=candidate;
     break;
    }
   }
   start=end;
  }
  if(picked)nextEligible[picked.asset_no]=round+picked.cooldown+1;
  return {picked,matched:candidates.length};
 }
 return Object.freeze({select});
})();
if(typeof module==='object'&&module.exports)module.exports=PresenceRoll;
