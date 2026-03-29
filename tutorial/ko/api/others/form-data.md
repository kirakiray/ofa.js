# formData



`formData` 메서드는 폼 요소에 바인딩된 객체 데이터를 생성하여 폼 요소를 보다 간단하고 효율적으로 처리할 수 있도록 합니다. 이 메서드는 대상 요소 내 모든 폼 요소의 값을 포함하는 객체를 생성하며, 해당 객체는 폼 요소의 변경 사항을 실시간으로 반영합니다.

아래 예시에서는 `formData` 메서드를 사용하여 폼 요소와 바인딩된 객체 데이터를 생성하는 방법을 보여줍니다:

<o-playground name="formData - 기본 사용법" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <form id="myForm">
        <input type="text" name="username" value="John Doe" />
        <div>
          성별:
          <label>
            남성
            <input type="radio" name="sex" value="man" />
          </label>
          <label>
            여성
            <input type="radio" name="sex" value="woman" />
          </label>
        </div>
        <textarea name="message">Hello World!</textarea>
      </form>
      <br />
      <div id="logger"></div>
      <script>
        const data = $("#myForm").formData();
        \$("#logger").text = data;
        data.watch(() => {
          \$("#logger").text = data;
        });
      </script>
    </template>
  </code>
</o-playground>

이 예제에서는 텍스트 입력 상자, 라디오 버튼, 텍스트 영역이 포함된 폼을 만들고, `formData` 메서드를 사용해 이 폼 요소들의 값을 담은 `data` 객체를 생성했습니다. 또한 `watch` 메서드를 사용해 데이터 변화를 감시하고, 데이터를 페이지에 실시간으로 표시했습니다. 사용자가 폼 요소의 값을 수정하면 `data` 객체가 그에 따라 업데이트되어 데이터 처리가 매우 간단하고 효율적으로 이루어집니다.

## 역방향 데이터 바인딩

생성된 객체 데이터는 역방향 바인딩 기능도 갖추고 있습니다. 즉, 객체의 속성을 수정하면 관련된 폼 요소 값이 자동으로 업데이트됩니다. 이는 폼 데이터 처리 시 매우 유용하며, 양방향 데이터 바인딩을 쉽게 구현할 수 있습니다.

아래 예제에서는 `formData` 메서드로 생성한 객체 데이터를 어떻게 활용하고, 역방향 데이터 바인딩을 어떻게 수행하는지를 보여줍니다:

<o-playground name="formData - 역방향 바인딩" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <form id="myForm">
        <input type="text" name="username" value="John Doe" />
        <div>
          성별:
          <label>
            남성
            <input type="radio" name="sex" value="man" />
          </label>
          <label>
            여성
            <input type="radio" name="sex" value="woman" />
          </label>
        </div>
        <textarea name="message">Hello World!</textarea>
      </form>
      <br />
      <div id="logger"></div>
      <script>
        const data = $("#myForm").formData();
        setTimeout(()=>{
          data.username = "Yao";
          data.sex = "man";
          data.message = "ofa.js is good!";
        },1000);
      </script>
    </template>
  </code>
</o-playground>

이 예제에서는 먼저 텍스트 입력 상자, 라디오 버튼 및 텍스트 영역을 포함하는 양식을 생성한 다음 `formData` 메서드를 사용하여 데이터 객체 `data`를 생성했습니다. 이후 `data` 객체의 속성을 수정하여 역방향 데이터 바인딩, 즉 양식 요소의 값이 객체 속성의 변경에 따라 자동으로 업데이트되도록 구현했습니다. 이러한 양방향 데이터 바인딩 기능은 양식 데이터와의 상호 작용을 더욱 편리하게 만듭니다.

## 특정 양식 감시

기본적으로 `formData()` 메서드는 대상 요소 내의 모든 `input`, `select`, `textarea` 요소를 수신합니다. 하지만 특정 폼 요소만 수신하려면 CSS 선택자를 전달하여 구현할 수 있습니다.

아래 예제에서는 CSS 선택자를 전달하여 특정 폼 요소를 감시하는 방법을 보여줍니다:

<o-playground name="formData - 특정 양식" style="--editor-height: 500px">
  <code path="demo.html">
    <template>
      <form id="myForm">
        <input type="text" name="username" value="John Doe" class="use-it" />
        <div>
          sex:
          <label>
            man
            <input type="radio" name="sex" value="man" class="use-it" />
          </label>
          <label>
            woman
            <input type="radio" name="sex" value="woman" class="use-it" />
          </label>
        </div>
        <textarea name="message">이 양식 요소는 바인딩되지 않았습니다</textarea>
      </form>
      <br />
      <div id="logger"></div>
      <script>
        const data = $("#myForm").formData(".use-it");
        \$("#logger").text = data;
        data.watch(() => {
          \$("#logger").text = data;
        });
      </script>
    </template>
  </code>
</o-playground>

이 예시에서는 `class`가 "use-it"인 폼 요소만을 감지하기 원하므로, `formData()` 메서드에 `".use-it"`을 인자로 전달합니다. 이렇게 하면 해당 클래스명을 가진 폼 요소만이 감지되고 생성된 데이터 객체에 포함됩니다. 이는 폼 요소를 선택적으로 감지하여 폼 데이터를 더 정밀하게 관리하는 데 유용합니다.

## 사용자 정의 양식

커스텀 폼 컴포넌트의 사용은 매우 간단합니다, 커스텀 컴포넌트에 **value 속성**을 하나 추가하고 **name 특성**을 설정하기만 하면 됩니다.

<o-playground name="formData - 사용자 정의 폼" style="--editor-height: 500px">
  <code path="demo.html" preview active>
    <template>
      <div id="myForm">
        <input type="text" name="username" value="John Doe" />
        <l-m src="./custom-input.html"></l-m>
        <custom-input name="message"></custom-input>
        <div id="logger"></div>
      </div>
      <script>
        const data = $("#myForm").formData("input,custom-input");
        \$("#logger").text = data;
        data.watch(() => {
          \$("#logger").text = data;
        });
      </script>
    </template>
  </code>
  <code path="custom-input.html">
    <template component>
      <style>
        :host{
          display: block;
        }
        .editor {
          display: inline-block;
          min-width: 200px;
          line-height: 30px;
          height: 30px;
          border: #aaa solid 1px;
          border-radius: 4px;
          padding: 4px;
          font-size: 14px;
        }
      </style>
      <div
        class="editor"
        contenteditable="plaintext-only"
        :text="value"
        on:input="changeText"
      ></div>
      <script>
        export default {
          tag:"custom-input",
          attrs: {
            name: "",
          },
          data: {
            value: "Default txt",
          },
          proto: {
            changeText(e) {
              this.value = $(e.target).text;
            },
          },
        };
      </script>
    </template>
  </code>
</o-playground>

사용자 지정 폼 컴포넌트를 사용할 때는 단지 이를 폼에 추가하고 필요한 `name` 속성을 설정하면 됩니다. 위 예시에서는 `<custom-input>` 요소를 추가하고 `name` 속성을 설정하여 사용자 지정 폼 컴포넌트를 사용했습니다. 이후 `formData()` 메서드를 사용해 입력 요소와 사용자 지정 컴포넌트의 값을 감시하며 실시간으로 폼 데이터를 가져오고 처리합니다. 이 방식은 폼에 사용자 지정 폼 컴포넌트를 포함하도록 매우 편리하게 확장할 수 있게 해주어 특정 요구사항을 충족시킬 수 있습니다.

## 컴포넌트 또는 페이지 내에서 폼 데이터 사용하기

때로는 컴포넌트나 페이지 내에서 폼 데이터를 사용해야 하며, `attached` 생명 주기 시점에 데이터를 생성해 컴포넌트에 바인딩해야 할 수도 있습니다.

<o-playground name="formData - 컴포넌트 내 사용" style="--editor-height: 600px">
  <code path="demo.html" preview>
    <template>
      <l-m src="./form-data-demo.html"></l-m>
      <form-data-demo></form-data-demo>
    </template>
  </code>
  <code path="form-data-demo.html" active>
    <template component>
      <style>
        :host{
          display: block;
        }
      </style>
      <input type="text" name="username" value="John Doe" />
      <div>{{logtext}}</div>
      <script>
        export default {
          tag:"form-data-demo",
          data: {
            fdata:{},
            logtext: ""
          },
          watch:{
            fdata(data){
              if(data){
                this.logtext = JSON.stringify(data);
              }
            }
          },
          attached(){
            this.fdata = this.shadow.formData();
          }
        };
      </script>
    </template>
  </code>
</o-playground>

`attached` 라이프사이클 주기를 통해 컴포넌트가 준비된 후, `this.shadow.formData()` 메서드를 사용하여 폼 데이터 객체 `fdata`를 생성했습니다.

`formData()`는 상호작용 로직이 비교적 간단한 폼 시나리오에 더 적합합니다.