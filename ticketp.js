const DJS11 = require('djs11');
const client = new DJS11.Client();

const fs = require('fs');  // REPL에서는 바로 쓸 수 있는데 여기서는 선언해야되네..

const reportQueueChannel = '740379718939050066';

const itoa = e => String(e);
const atoi = e => Number(e);

// https://stackoverflow.com/questions/1183872/put-a-delay-in-javascript
function timeout(ms) {
	var s = new Date().getTime();
	while(1) {
		if(new Date().getTime() - s > ms) break;
	}
}

var jsnTickets = require('./tickets.json');

// https://stackoverflow.com/questions/5223/length-of-a-javascript-object
function sizeof(o) {
    var r = 0, k;
    
	for(k in o) {
        if(o.hasOwnProperty(k)) r++;
    }
	
    return r;
}

function EmbedMsgbox(typ, content, lang = "k") {
	if( typ == '!' ) {
		switch(lang) {
			case 'k':
				var MsgBox = new DJS11.RichEmbed()
					.setColor('#00C8C8')
					.setTitle('주의')
					.setDescription( "<:WXPMBX03:706030882036908032> " + content );
				
				return MsgBox;
			break ; case 'e':
				MsgBox = new DJS11.RichEmbed()
					.setColor('#00C8C8')
					.setTitle('Warning')
					.setDescription( "<:WXPMBX03:706030882036908032> " + content );
				
				return MsgBox;
		}
	} else if( typ.toUpperCase() == 'X' ) {
		switch(lang) {
			case 'k':
				var MsgBox = new DJS11.RichEmbed()
					.setColor('#00C8C8')
					.setTitle('문제가 발생했습니다!')
					.setDescription( "<:WXPMBX01:704469296683810836> " + content );
				
				return MsgBox;
			break ; case 'e':
				MsgBox = new DJS11.RichEmbed()
					.setColor('#00C8C8')
					.setTitle('Error')
					.setDescription( "<:WXPMBX01:704469296683810836> " + content );
				
				return MsgBox;
		}
	} else if( typ == '?' ) {
		switch(lang) {
			case 'k':
				var MsgBox = new DJS11.RichEmbed()
					.setColor('#00C8C8')
					.setTitle('질문')
					.setDescription( "<:W95MBX02:704529164396658720> " + content );
				
				return MsgBox;
			break ; case 'e':
				MsgBox = new DJS11.RichEmbed()
					.setColor('#00C8C8')
					.setTitle('Question')
					.setDescription( "<:W95MBX02:704529164396658720> " + content );
				
				return MsgBox;
		}
	} else {
		switch(lang) {
			case 'k':
				var MsgBox = new DJS11.RichEmbed()
					.setColor('#00C8C8')
					.setTitle('알림')
					.setDescription( "<:W95MBX04:704529118280155196> " + content );
				
				return MsgBox;
			break ; case 'e':
				MsgBox = new DJS11.RichEmbed()
					.setColor('#00C8C8')
					.setTitle('Notification')
					.setDescription( "<:W95MBX04:704529118280155196> " + content );
				
				return MsgBox;
		}
	}
}

client.on('ready', () => {
	client.user.setPresence({
		status: 'online',
		game: {
			name: 'r!cmdhelp',
			type: 'WATCHING'
		}
	});
});

client.on('message', msg => {
	const report  = msg.content.match(/^r[!]report\s{0,}(.+)[|](.+)[|](.+)/i);
	const help    = msg.content.match(/^r[!]help\s{0,}[<][@]([!]|)(\d+)[>][|](.+)[|](.+)[|](.+)/i);
	const cancel  = msg.content.match(/^r[!]cancel\s{0,}(\d+)/i);
	const view    = msg.content.match(/^r[!]view\s{0,}(\d+)/i);
	const reject  = msg.content.match(/^r[!]reject\s{0,}(\d+)(.+)/i);
	const resolve = msg.content.match(/^r[!]resolve\s{0,}(\d+)(.+)/i);
	const close  = msg.content.match(/^r[!]close\s{0,}(\d+)/i);
	
	if(msg.content.toLowerCase().startsWith('r!report') && !report)
	{
		msg.channel.send('[오류!] 구문: `r!report 제목 | 내용 | 중요도(1부터 3까지)`');
		return;
	}
	
	if(msg.content.toLowerCase().startsWith('r!help') && !help)
	{
		msg.channel.send('[오류!] 구문: `r!help @호출할-관리자-이름-멘션(핑) | 제목 | 내용 | 중요도(1부터 3까지)`');
		return;
	}
	
	if(msg.content.toLowerCase().startsWith('r!cancel') && !cancel)
	{
		msg.channel.send('[오류!] 구문: `r!cancel 접수번호`');
		return;
	}
	
	if(msg.content.toLowerCase().startsWith('r!view') && !view)
	{
		msg.channel.send('[오류!] 구문: `r!view 접수번호`');
		return;
	}
	
	if(msg.content.toLowerCase().startsWith('r!reject') && !reject)
	{
		msg.channel.send('[오류!] 구문: `r!reject 접수번호 메시지`');
		return;
	}
	
	if(msg.content.toLowerCase().startsWith('r!resolve') && !resolve)
	{
		msg.channel.send('[오류!] 구문: `r!resolve 접수번호 메시지`');
		return;
	}
	
	if(msg.content.toLowerCase().startsWith('r!close') && !close)
	{
		msg.channel.send('[오류!] 구문: `r!close 접수번호`');
		return;
	}
	
	if(report)
	{
		const title      =         report[1] ;
		const content    =         report[2] ;
		const importance = Number(report[3]);
		
		msg.guild.members.filter(m => 
			m.roles.find(r => r.id == '723076675503390742') ||
			m.roles.find(r => r.id == '682961210408173577') ||
			m.roles.find(r => r.id == '670625248525156352') ||
			m.roles.find(r => r.id == '682961359688040458')
		).forEach(m => {
			if(
				m.roles.find(r => r.id == '723076675503390742') ||
				m.roles.find(r => r.id == '682961210408173577') ||
				m.roles.find(r => r.id == '670625248525156352') ||
				m.roles.find(r => r.id == '682961359688040458')
			) {
				m.user.send('신고가 왔읍니다. <#' + reportQueueChannel + '>를 확인해주세요.').then(m => {}).catch(e => {});
				timeout(1000);
			}
		});
		
		const id = itoa(sizeof(jsnTickets) + 1);
		
		const _embed = new DJS11.RichEmbed()
							.setColor('#00C8C8')
							.setTitle('[신고] ' + title)
							.setDescription(content)
							.addField('중요도', (importance == 3 ? '높음' : (importance == 2 ? '보통' :'낮음')), true)
							.addField('접수 번호', '#' + id, true);
		
		client.channels.get(reportQueueChannel).send(_embed).then(m => {
			jsnTickets[id] = {
				'title': title,
				description: content,
				'importance': importance,
				type: 'report',
				requester: msg.member.user.id,
				embed_message_id: m.id
			};
		
			fs.writeFile('./tickets.json', JSON.stringify(jsnTickets), 'utf8', e => {});
			
			msg.channel.send(EmbedMsgbox('I', '신고가 접수되었읍니다. 접수번호는 #' + id + '입니다.'));
		});
	}
	
	/*if(help)
	{
		const title      =         report[1] ;
		const content    =         report[2] ;
		const importance = Number(report[3]);
		
		msg.server.members.forEach(m => {
			if(
				m.roles.find('723076675503390742') ||
				m.roles.find('682961210408173577') ||
				m.roles.find('670625248525156352') ||
				m.roles.find('682961359688040458')
			) {
				m.sendMessage('신고가 왔읍니다. <#' + reportQueueChannel + '>를 확인해주세요.');
				timeout(1000);
			}
		});
		
		const _embed = new DJS11.RichEmbed()
							.setColr('#00C8C8')
							.setTitle('[신고] ' + title)
							.setDescription(content)
							.setFooter('중요도: ' + importance == 3 ? '높음' : (importance == 2 ? '보통' :'낮음'));
		
		client.channels.get(reportQueueChannel).send(_embed);
	}*/
	
	if(cancel)
	{
		const requestID = cancel[1];
		if(!jsnTickets[requestID] || jsnTickets[requestID]['requester'] != msg.member.user.id)
		{
			msg.channel.send(EmbedMsgbox('X', '요청이 올바르지 않거나 다른 사람이 문의했으면 취소할 수 없습니다.'));
			return;
		}
		
		client.channels.get(reportQueueChannel).fetchMessage(jsnTickets[requestID]['embed_message_id']).then(m => m.delete(1)).catch(console.error);
		
		// delete jsnTickets[requestID];
		jsnTickets[requestID] = null;
		
		fs.writeFile('./tickets.json', JSON.stringify(jsnTickets), 'utf8', e => {});
		
		msg.channel.send(EmbedMsgbox('I', '취소되었읍니다.'));
	}
	
	if(view)
	{
		const requestID = view[1];
		if(!jsnTickets[requestID] || jsnTickets[requestID]['requester'] != msg.member.user.id)
		{
			msg.channel.send(EmbedMsgbox('X', '요청이 올바르지 않거나 다른 사람이 문의했으면 조회할 수 없습니다.'));
			return;
		}
		
		const __embed_2 = new DJS11.RichEmbed()
			.setColor('#00C8C8')
			.setTitle('[신고] ' + jsnTickets[requestID]['title'])
			.setDescription(jsnTickets[requestID]['description'])
			.addField('중요도', (jsnTickets[requestID]['importance'] == 3 ? '높음' : (jsnTickets[requestID]['importance'] == 2 ? '보통' :'낮음')), true)
			.addField('접수 번호', '#' + requestID, true);
			
		msg.channel.send(__embed_2);
	}
	
	if(resolve)
	{
		const requestID = resolve[1];
		const message   = resolve[2];
		
		const m = msg.member;
		if(
			!(m.roles.find(r => r.id == '723076675503390742') ||
			m.roles.find(r => r.id == '682961210408173577') ||
			m.roles.find(r => r.id == '670625248525156352') ||
			m.roles.find(r => r.id == '682961359688040458'))
		) {
			msg.channel.send(EmbedMsgbox('X', '관리자만 가능합니다.'));
			return;
		}
		
		if(!jsnTickets[requestID] || jsnTickets[requestID]['requester'] != msg.member.user.id)
		{
			msg.channel.send(EmbedMsgbox('X', '요청이 올바르지 않거나 다른 사람이 문의했으면 조회할 수 없습니다.'));
			return;
		}
		
		const __embed_3 = new DJS11.RichEmbed()
			.setColor('#00C8C8')
			.setTitle(`요청 ${jsnTickets[requestID]['title']}에 대한 ${msg.member.user.username}의 답변`)
			.setDescription(message);
		
		try {
			client.users.find(u => u.id == jsnTickets[requestID]['requester']).send(__embed_3);
			
			client.channels.get(reportQueueChannel).fetchMessage(jsnTickets[requestID]['embed_message_id']).then(m => m.delete(1)).catch(console.error);
		
			// delete jsnTickets[requestID];
			jsnTickets[requestID] = null;
			
			fs.writeFile('./tickets.json', JSON.stringify(jsnTickets), 'utf8', e => {});
		} catch(e) {
			msg.channel.send(EmbedMsgbox('X', '응답을 요청자에게 전송하지 못했읍니다.'));
		}
	}
	
	if(reject)
	{
		const requestID = reject[1];
		const message   = reject[2];
		
		const m = msg.member;
		if(
			!(m.roles.find(r => r.id == '723076675503390742') ||
			m.roles.find(r => r.id == '682961210408173577') ||
			m.roles.find(r => r.id == '670625248525156352') ||
			m.roles.find(r => r.id == '682961359688040458'))
		) {
			msg.channel.send(EmbedMsgbox('X', '관리자만 가능합니다.'));
			return;
		}
		
		if(!jsnTickets[requestID] || jsnTickets[requestID]['requester'] != msg.member.user.id)
		{
			msg.channel.send(EmbedMsgbox('X', '요청이 올바르지 않거나 다른 사람이 문의했으면 조회할 수 없습니다.'));
			return;
		}
		
		const __embed_4 = new DJS11.RichEmbed()
			.setColor('#00C8C8')
			.setTitle(`요청 ${jsnTickets[requestID]['title']}이 거절되었읍니다. (${msg.member.user.username})`)
			.setDescription(message);
		
		try {
			client.users.find(u => u.id == jsnTickets[requestID]['requester']).send(__embed_4);
			
			client.channels.get(reportQueueChannel).fetchMessage(jsnTickets[requestID]['embed_message_id']).then(m => m.delete(1)).catch(console.error);
		
			// delete jsnTickets[requestID];
			jsnTickets[requestID] = null;
			
			fs.writeFile('./tickets.json', JSON.stringify(jsnTickets), 'utf8', e => {});
		} catch(e) {
			msg.channel.send(EmbedMsgbox('X', '응답을 요청자에게 전송하지 못했읍니다.'));
		}
	}
	
	if(close)
	{
		const requestID = close[1];
		const m = msg.member;
		
		if(
			!(m.roles.find(r => r.id == '723076675503390742') ||
			m.roles.find(r => r.id == '682961210408173577') ||
			m.roles.find(r => r.id == '670625248525156352') ||
			m.roles.find(r => r.id == '682961359688040458'))
		) {
			msg.channel.send(EmbedMsgbox('X', '관리자만 가능합니다.'));
			return;
		}
		
		client.channels.get(reportQueueChannel).fetchMessage(jsnTickets[requestID]['embed_message_id']).then(m => m.delete(1)).catch(console.error);
		
		// delete jsnTickets[requestID];
		jsnTickets[requestID] = null;
		
		fs.writeFile('./tickets.json', JSON.stringify(jsnTickets), 'utf8', e => {});
	}
	
	if(msg.content.toLowerCase().startsWith('r!cmdhelp'))
	{
		msg.channel.send(`\
<명령 목록>
 - r!report: 신고를 올립니다.
 - r!view: 신고를 조회합니다.
 - r!cancel: 신고를 지웁니다.
 - r!resolve: 신고에 답변합니다.
 - r!reject: 신고를 거절합니다.`);
	}
});

client.login('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
