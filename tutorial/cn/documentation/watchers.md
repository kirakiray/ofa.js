# 侦听器

<o-playground style="--editor-height: 500px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
      </style>
      <p>
        count:{{count}}
        <br />
        doubleCount:{{doubleCount}}
      </p>
      <input sync:value="count" type="number" />
      <script>
        export default async () => {
          return {
            data: {
              count: 0,
              doubleCount: 0,
            },
            watch: {
              count(count) {
                setTimeout(() => {
                  this.doubleCount = count * 2;
                }, 500);
              },
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>
