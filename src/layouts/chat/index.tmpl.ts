import './index.scss';

const tmpl: string = `
    <div class="chat__layout">
        <aside>
            <div class="aside__header">
                <div data-component="newChatBtn"></div>
                <div data-component="profileBtn"></div>
            </div>
            <div class="aside__chat-list">
                {{#if children.chatList}}
                    {{#each children.chatList}}
                        <div
                            data-component="chatList"
                            data-key="{{@index}}"
                            ></div>
                    {{/each}}
                {{else}}
                <div class="aside__stub">У Вас пока нет чатов. Давайте создадим беседу!</div>
                {{/if}}
            </div>    
        </aside>
        <main>
            <div class="chat__header">
                <div class="chat__icon">
                    {{#if chatImg}}
                        <img src="{{chatImg}}" alt="">
                    {{/if}}
                </div>
                <div class="chat__name">{{ chatName }}</div>
                <div class="chat__menu"></div>
            </div>
            <div class="chat__content">
                {{#if children.messages}}
                    {{#each children.messages}}
                        <div
                            data-component="messages"
                            data-key="{{@index}}"
                            ></div>
                    {{/each}}
                {{else}}
                    <div>Пока нет сообщений.</div>
                {{/if}}
            </div>
            <div class="chat__create">
                <div data-component="newMessageFiles"></div>
                <div data-component="newMessageInput"></div>
                <div data-component="sendMessage"></div>
            </div>
        </main>
    </div> 
`;

export default tmpl;
