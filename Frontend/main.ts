$(() => {
  /**
   * 元素 DOM 操作缓存器
   * @param muyu 木鱼 DOM 节点
   * @param AllServer 全服
   * @param AllClick 总计
   * @param TodayClick 今日敲击
   */
  type elements = {
    loginBtn: JQuery;
    muyu: JQuery;
    AllServer: JQuery;
    AllClick: JQuery;
    TodayClick: JQuery;
    commitGunas: JQuery;
    uploadGunas: JQuery;
    commitGunasModal: bootstrap.Modal;
    loginModal: bootstrap.Modal;
    errorModal: bootstrap.Toast;
    errorMsg: JQuery;
    regBtn: JQuery;
    InputRegPassword: JQuery;
    regUser: bootstrap.Modal;
    InputPasswordConfirm: JQuery;
    url: string;
  };
  type AllServerAPIResponse = {
    result: {
      gunas: number;
    };
  };
  const fetchTemplates = {
    GET: {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
      },
      redirect: "follow",
    },
  };
  type StorageType = {
    expires: number;
    value: number;
    startTime: number;
  };
  interface IStorage {
    /**
     * 设置 Item
     * @param params
     */
    setItem: (index: string, params: StorageType) => void;
    /**
     * 获取值
     * @param name 索引
     * @returns {any} 值
     */
    getItem: any;
    /**
     * 擦除值
     * @param name 索引
     */
    removeItem: any;
    /**
     * 格式化
     */
    clear: any;
  }
  /**
   * 增强版本地存储
   */
  class Storage implements IStorage {
    setItem(
      index: string,
      params: {
        value: any;
        expries?: number;
        startTime: number;
      }
    ) {
      console.log(params);
      localStorage.setItem(index, JSON.stringify(params));
    }
    getItem(name: string) {
      let item: any = localStorage.getItem(name) || "";
      try {
        item = JSON.parse(item);
      } catch (error) {
        item = item;
      }
      if (item.startTime) {
        const date = new Date().getTime();
        if (date - item.startTime > item.expires) {
          console.log(item, "已清理");
          localStorage.removeItem(name);
          return false;
        } else {
          return item.value;
        }
      } else {
        return item;
      }
    }
    removeItem(name: string) {
      localStorage.removeItem(name);
    }
    clear() {
      localStorage.clear();
    }
  }
  const DeeperStorage: IStorage = new Storage();
  type addGunasObj = {
    AllGunas: number;
    TodayGunas: number;
  };
  /**
   * 功德操作
   */
  class Gunas {
    getAllGunas() {
      return DeeperStorage.getItem("AllGunas");
    }
    getTodayGunas() {
      return DeeperStorage.getItem("TodayGunas");
    }
    addGunas(num: number): addGunasObj {
      localStorage.setItem(
        "AllGunas",
        JSON.stringify({
          value: this.getAllGunas().value + num,
        })
      );
      DeeperStorage.setItem("TodayGunas", {
        value: this.getTodayGunas() + num,
        expires: 60 * 60 * 24 * 1000,
        startTime: new Date().getTime(),
      });
      return {
        AllGunas: this.getAllGunas().value,
        TodayGunas: this.getTodayGunas(),
      };
    }
  }
  // 浅浅 new 一个
  const GunasControler = new Gunas();
  // 定义 ElementControler 类
  class ElementControler {
    element: elements;
    audio: any;
    state: any;
    constructor(args: any) {
      this.element = args;
      this.state = new Map();
      this.audio = new Audio(args.url);
    }
    /**
     * @param index 索引
     * @param value 值
     * 用于设置 State
     */
    private setState(index: string | number, value: any): void {
      this.state.set(index, value);
    }
    /**
     * @param index 索引
     * @returns {any} 返回 State 信息
     */
    private getState(index: string | number): any {
      return this.state.get(index);
    }
    private hasState(index: any): boolean {
      return this.state.has(index);
    }
    /**
     * @param url 链接
     * @param options Fetch 配置
     * @returns {any} 返回已解构 JSON 的对象
     */
    private async getData(url: string, options: any) {
      try {
        const response = await fetch(url, options);
        return await response.json();
      } catch (error) {
        return error;
      }
    }
    private async uploadGunas(gunas: number, auth?: string): Promise<void> {
      return new Promise<void>((resolve, reject): void => {
        $.ajax({
          method: "PUT",
          url: "/api/gunas",
          headers: { "Content-Type": "application/json" },
          data: JSON.stringify({ gunas, auth }),
          success: (res): void => resolve(res),
          error: (_xhr, _status, err): void => reject(err),
        });
      });
    }
    /**
     * 初始化存储系统函数
     */
    private async initStorage(): Promise<void> {
      this.hasState("gunas") || this.setState("gunas", 0);
      // 如果先前没有存储过，现在创建
      if (!localStorage.getItem("AllGunas")) {
        localStorage.setItem("AllGunas", JSON.stringify({ value: 0 }));
      }
      if (!localStorage.getItem("TodayGunas")) {
        localStorage.setItem(
          "TodayGunas",
          JSON.stringify({
            value: 1,
            expires: 60 * 60 * 24 * 1000,
            startTime: new Date().getTime(),
          })
        );
      }
      return;
    }
    private showErr(
      msg:
        | string
        | number
        | boolean
        | ((
            this: HTMLElement,
            index: number,
            text: string
          ) => string | number | boolean)
    ) {
      this.element.errorModal.show();
      this.element.errorMsg.text(msg);
    }
    private initRanking() {
      $("#GunasRankingList").html(
        `<tr class="table-active" id="GunasRankingListContainer">
        <th scope="row">功德数</th>
        <td>电子邮箱</td>
        <td>ID</td>
      </tr>`
      );
      $.get("/api/ranking")
        .done((res: { data: Array<any> }) => {
          console.log(res);
          // 用 Array 默认迭代器会导致顺序问题
          for (let i = 0; i < res.data.length; i++) {
            const item = res.data.at(i);
            const table = $("<tr></tr>").append(
              `<td>${item.gunas}</td><td>${item.email}</td><td>${item.id}</td>`
            );
            $("#GunasRankingList").append(table);
          }
        })
        .fail((xhr) => {
          this.showErr(xhr?.responseJSON.message);
        });
    }
    private async updateAllServer() {
      try {
        const res: AllServerAPIResponse = await this.getData(
          "/api/gunas",
          fetchTemplates.GET
        );
        if (!res.result.gunas) throw res; //直接抛了
        this.setState("allserver", res.result.gunas);
        this.element.AllServer.text(
          `${this.getState("allserver")} + ${this.getState("gunas")}`
        );
      } catch (error) {
        this.element.AllServer.text("数据获取失败");
        console.error(error);
      }
    }
    /**
     * 初始化函数
     */
    public async init(): Promise<void> {
      this.initStorage();
      // 获取全服功德数据
      this.updateAllServer();
      $("#GunasRankingBtn").on("click", this.initRanking);
      // 预备更新
      this.element.AllClick.text(GunasControler.getAllGunas().value);
      this.element.TodayClick.text(GunasControler.getTodayGunas());
      // 绑定事件
      this.element.muyu.on("click", () => {
        this.element.muyu.addClass("Zoom");
        $("#GunasPlus").addClass("GunasPlus");
        // 更新数据
        const contentData = GunasControler.addGunas(1);
        // 设置两项数据
        this.element.AllClick.text(contentData.AllGunas);
        this.element.TodayClick.text(contentData.TodayGunas);
        // 设置服务端
        this.element.AllServer.text(
          `${this.getState("allserver")} + ${this.getState("gunas")}`
        );
        this.setState("gunas", this.getState("gunas") + 1);
        console.log(this.state);
        this.audio.play();
      });
      this.element.commitGunas.on("click", (e) => {
        e.preventDefault();
        if (!DeeperStorage.getItem("token")) {
          this.element.loginModal.toggle();
          return;
        }
        this.element.commitGunasModal.toggle();
      });
      this.element.uploadGunas.on("click", (e) => {
        e.preventDefault();
        if (this.getState("gunas") < 1) {
          this.showErr("请确保当前现有功德满 1，否则佛祖把你拖下去");
          this.element.commitGunasModal.toggle();
          return;
        }
        this.uploadGunas(this.getState("gunas"), DeeperStorage.getItem("token"))
          .then((res: any) => {
            console.log(res);
            this.element.commitGunasModal.toggle();
            this.setState("allserver", this.getState("allserver") + res.add);
            this.setState("gunas", 0);
            this.updateAllServer();
            alert("上传成功！");
          })
          .catch((err) => {
            console.error(err);
            this.element.commitGunasModal.hide();
            this.showErr(
              "服务端拒绝接收，查看控制台并寻找管理员解决 100% 问题"
            );
          });
      });
      this.element.loginBtn.on("click", (e) => {
        e.preventDefault();
        $.post("/api/user", {
          id: $("#InputID").val(),
          password: $("#InputPassword").val(),
        })
          .done((res) => {
            res?.token
              ? localStorage.setItem(
                  "token",
                  JSON.stringify({
                    value: res.token,
                    expires: 60 * 60 * 24 * 1000,
                    startTime: new Date().getTime(),
                  })
                )
              : this.showErr(
                  "客户端拒绝接收，查看控制台并寻找管理员解决 100% 问题"
                );
            alert("登录成功！");
            this.element.loginModal.hide();
            console.log(res);
          })
          .catch((err) => {
            this.element.errorModal.show();
            this.element.errorMsg.text("登录出现错误");
            throw err;
          });
      });
      this.element.regBtn.on("click", (e) => {
        e.preventDefault();
        const password = this.element.InputPasswordConfirm.val(),
          isConfirm =
            this.element.InputRegPassword.val() === password &&
            password?.toString().search(/^[a-zA-Z0-9_-]{4,16}$/) !== -1;
        if (isConfirm) {
          $.ajax({
            method: "PUT",
            url: "/api/user",
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({ email: $("#InputEmail").val(), password }),
          })
            .done((res) => {
              const errShow = () => {
                this.element.errorModal.show();
                this.element.errorMsg.text("服务端错误");
              };
              res?.token
                ? localStorage.setItem(
                    "token",
                    JSON.stringify({
                      value: res.token,
                      expires: 60 * 60 * 24 * 1000,
                      startTime: new Date().getTime(),
                    })
                  )
                : errShow;
              this.element.regUser.toggle();
            })
            .catch((xhr) => {
              this.element.errorModal.show();
              this.element.errorMsg.text(xhr?.responseJSON.message);
              console.error(xhr);
              return;
            });
        } else {
          this.element.errorModal.show();
          this.element.errorMsg.text("请确保密码一致 | 密码强度过低");
        }
      });
      // 设置监听器
      this.audio.addEventListener("ended", () => {
        $(this.element.muyu).removeClass("Zoom");
        $("#GunasPlus").removeClass("GunasPlus");
      });
    }
  }
  // 变量名就稍微随性一点
  const options: elements = {
    muyu: $("#muyu"),
    TodayClick: $("#TodayClick-Guna"),
    AllServer: $("#AllServer-Guna"),
    url: "./static/audio/muyu.mp3",
    AllClick: $("#AllClick-Guna"),
    uploadGunas: $("#uploadGunas"),
    commitGunas: $("#commitGunas"),
    commitGunasModal: new bootstrap.Modal("#commitGunasModal", {
      keyboard: true,
    }),
    loginBtn: $("#loginBtn"),
    loginModal: new bootstrap.Modal("#loginModal"),
    regBtn: $("#regBtn"),
    InputPasswordConfirm: $("#InputPasswordConfirm"),
    InputRegPassword: $("#InputRegPassword"),
    errorModal: new bootstrap.Toast("#ErrorModal"),
    errorMsg: $("#ErrorMsg"),
    regUser: new bootstrap.Modal("#regUser"),
  };
  const el = new ElementControler(options);
  el.init();
});
