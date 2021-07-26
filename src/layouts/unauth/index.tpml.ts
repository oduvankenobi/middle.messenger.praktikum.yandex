import './index.scss';
import regFormInput from '../../components/formInput';

regFormInput();

const template: string = `
    <div class="unauth__layout">
        <div class="unauth__card">
            <div class="unauth__title">{{ form_title }}</div>
            <form>
                {{#each fields}}
                    {{> form-input this}}
                {{/each}}
                <button class="_general _primary">
                    <a href="{{ submit_btn.onClick }}" >
                        {{ submit_btn.text }}
                    </a>
                </button>
            </form>        
            <div class="controls">
                <button class="_flat" >
                    <a href="{{ alt_btn.onClick }}">
                        {{ alt_btn.text }}
                    </a>
                </button>            
            </div>  
        </div>
    </div>
`;

export default template;
