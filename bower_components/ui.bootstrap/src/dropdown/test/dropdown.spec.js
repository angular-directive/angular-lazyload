describe('dropdownToggle', function() {
  var $compile, $rootScope, $document, $templateCache, dropdownConfig, element, $browser;

  beforeEach(module('ui.bootstrap.dropdown'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$document_, _$templateCache_, _dropdownConfig_, _$browser_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $document = _$document_;
    $templateCache = _$templateCache_;
    dropdownConfig = _dropdownConfig_;
    $browser = _$browser_;
  }));

  afterEach(function() {
    element.remove();
  });

  var clickDropdownToggle = function(elm) {
    elm = elm || element;
    elm.find('a[dropdown-toggle]').click();
  };

  var triggerKeyDown = function (element, keyCode) {
    var e = $.Event('keydown');
    e.which = keyCode;
    element.trigger(e);
  };

  var isFocused = function(elm) {
    return elm[0] === document.activeElement;
  };

  describe('basic', function() {
    function dropdown() {
      return $compile('<li dropdown><a href dropdown-toggle></a><ul><li><a href>Hello</a></li></ul></li>')($rootScope);
    }

    beforeEach(function() {
      element = dropdown();
    });

    it('should toggle on `a` click', function() {
      expect(element.hasClass(dropdownConfig.openClass)).toBe(false);
      clickDropdownToggle();
      expect(element.hasClass(dropdownConfig.openClass)).toBe(true);
      clickDropdownToggle();
      expect(element.hasClass(dropdownConfig.openClass)).toBe(false);
    });

    it('should toggle when an option is clicked', function() {
      $document.find('body').append(element);
      expect(element.hasClass(dropdownConfig.openClass)).toBe(false);
      clickDropdownToggle();
      expect(element.hasClass(dropdownConfig.openClass)).toBe(true);

      var optionEl = element.find('ul > li').eq(0).find('a').eq(0);
      optionEl.click();
      expect(element.hasClass(dropdownConfig.openClass)).toBe(false);
    });

    it('should close on document click', function() {
      clickDropdownToggle();
      expect(element.hasClass(dropdownConfig.openClass)).toBe(true);
      $document.click();
      expect(element.hasClass(dropdownConfig.openClass)).toBe(false);
    });

    it('should close on escape key & focus toggle element', function() {
      $document.find('body').append(element);
      clickDropdownToggle();
      triggerKeyDown($document, 27);
      expect(element.hasClass(dropdownConfig.openClass)).toBe(false);
      expect(isFocused(element.find('a'))).toBe(true);
    });

    it('should not close on backspace key', function() {
      clickDropdownToggle();
      triggerKeyDown($document, 8);
      expect(element.hasClass(dropdownConfig.openClass)).toBe(true);
    });

    it('should close on $location change', function() {
      clickDropdownToggle();
      expect(element.hasClass(dropdownConfig.openClass)).toBe(true);
      $rootScope.$broadcast('$locationChangeSuccess');
      $rootScope.$apply();
      expect(element.hasClass(dropdownConfig.openClass)).toBe(false);
    });

    it('should only allow one dropdown to be open at once', function() {
      var elm1 = dropdown();
      var elm2 = dropdown();
      expect(elm1.hasClass(dropdownConfig.openClass)).toBe(false);
      expect(elm2.hasClass(dropdownConfig.openClass)).toBe(false);

      clickDropdownToggle( elm1 );
      expect(elm1.hasClass(dropdownConfig.openClass)).toBe(true);
      expect(elm2.hasClass(dropdownConfig.openClass)).toBe(false);

      clickDropdownToggle( elm2 );
      expect(elm1.hasClass(dropdownConfig.openClass)).toBe(false);
      expect(elm2.hasClass(dropdownConfig.openClass)).toBe(true);
    });

    it('should not toggle if the element has `disabled` class', function() {
      var elm = $compile('<li dropdown><a class="disabled" dropdown-toggle></a><ul><li>Hello</li></ul></li>')($rootScope);
      clickDropdownToggle( elm );
      expect(elm.hasClass(dropdownConfig.openClass)).toBe(false);
    });

    it('should not toggle if the element is disabled', function() {
      var elm = $compile('<li dropdown><button disabled="disabled" dropdown-toggle></button><ul><li>Hello</li></ul></li>')($rootScope);
      elm.find('button').click();
      expect(elm.hasClass(dropdownConfig.openClass)).toBe(false);
    });

    it('should not toggle if the element has `ng-disabled` as true', function() {
      $rootScope.isdisabled = true;
      var elm = $compile('<li dropdown><div ng-disabled="isdisabled" dropdown-toggle></div><ul><li>Hello</li></ul></li>')($rootScope);
      $rootScope.$digest();
      elm.find('div').click();
      expect(elm.hasClass(dropdownConfig.openClass)).toBe(false);

      $rootScope.isdisabled = false;
      $rootScope.$digest();
      elm.find('div').click();
      expect(elm.hasClass(dropdownConfig.openClass)).toBe(true);
    });

    it('should unbind events on scope destroy', function() {
      var $scope = $rootScope.$new();
      var elm = $compile('<li dropdown><button ng-disabled="isdisabled" dropdown-toggle></button><ul><li>Hello</li></ul></li>')($scope);
      $scope.$digest();

      var buttonEl = elm.find('button');
      buttonEl.click();
      expect(elm.hasClass(dropdownConfig.openClass)).toBe(true);
      buttonEl.click();
      expect(elm.hasClass(dropdownConfig.openClass)).toBe(false);

      $scope.$destroy();
      buttonEl.click();
      expect(elm.hasClass(dropdownConfig.openClass)).toBe(false);
    });

    // issue 270
    it('executes other document click events normally', function() {
      var checkboxEl = $compile('<input type="checkbox" ng-click="clicked = true" />')($rootScope);
      $rootScope.$digest();

      expect(element.hasClass(dropdownConfig.openClass)).toBe(false);
      expect($rootScope.clicked).toBeFalsy();

      clickDropdownToggle();
      expect(element.hasClass(dropdownConfig.openClass)).toBe(true);
      expect($rootScope.clicked).toBeFalsy();

      checkboxEl.click();
      expect($rootScope.clicked).toBeTruthy();
    });

    // WAI-ARIA
    it('should aria markup to the `dropdown-toggle`', function() {
      var toggleEl = element.find('a');
      expect(toggleEl.attr('aria-haspopup')).toBe('true');
      expect(toggleEl.attr('aria-expanded')).toBe('false');

      clickDropdownToggle();
      expect(toggleEl.attr('aria-expanded')).toBe('true');
      clickDropdownToggle();
      expect(toggleEl.attr('aria-expanded')).toBe('false');
    });

    // pr/issue 3274
    it('should not raise $digest:inprog if dismissed during a digest cycle', function () {
      clickDropdownToggle();
      expect(element.hasClass(dropdownConfig.openClass)).toBe(true);

      $rootScope.$apply(function () {
        $document.click();
      });

      expect(element.hasClass(dropdownConfig.openClass)).toBe(false);
    });
  });
  
  describe('using dropdownMenuTemplate', function() {
    function dropdown() {
      $templateCache.put('custom.html', '<ul class="dropdown-menu"><li>Item 1</li></ul>');

      return $compile('<li dropdown><a href dropdown-toggle></a><ul class="dropdown-menu" template-url="custom.html"></ul></li>')($rootScope);
    }

    beforeEach(function() {
      element = dropdown();
    });
    
    it('should apply custom template for dropdown menu', function() {
      element.find('a').click();
      expect(element.find('ul.dropdown-menu').eq(0).find('li').eq(0).text()).toEqual('Item 1');
    });

    it('should clear ul when dropdown menu is closed', function() {
      element.find('a').click();
      expect(element.find('ul.dropdown-menu').eq(0).find('li').eq(0).text()).toEqual('Item 1');
      element.find('a').click();
      expect(element.find('ul.dropdown-menu').eq(0).find('li').length).toEqual(0);
    });
  });

  describe('using dropdown-append-to-body', function() {
    function dropdown() {
      return $compile('<li dropdown dropdown-append-to-body><a href dropdown-toggle></a><ul class="dropdown-menu" id="dropdown-menu"><li><a href>Hello On Body</a></li></ul></li>')($rootScope);
    }

    beforeEach(function() {
      element = dropdown();
    });

    it('adds the menu to the body', function() {
      expect($document.find('#dropdown-menu').parent()[0]).toBe($document.find('body')[0]);
    });

    it('removes the menu when the dropdown is removed', function() {
      element.remove();
      $rootScope.$digest();
      expect($document.find('#dropdown-menu').length).toEqual(0);
    });
  });

  describe('integration with $location URL rewriting', function() {
    function dropdown() {

      // Simulate URL rewriting behavior
      $document.on('click', 'a[href="#something"]', function () {
        $rootScope.$broadcast('$locationChangeSuccess');
        $rootScope.$apply();
      });

      return $compile('<li dropdown><a href dropdown-toggle></a>' +
        '<ul><li><a href="#something">Hello</a></li></ul></li>')($rootScope);
    }

    beforeEach(function() {
      element = dropdown();
    });

    it('should close without errors on $location change', function() {
      $document.find('body').append(element);
      clickDropdownToggle();
      expect(element.hasClass(dropdownConfig.openClass)).toBe(true);
      var optionEl = element.find('ul > li').eq(0).find('a').eq(0);
      optionEl.click();
      expect(element.hasClass(dropdownConfig.openClass)).toBe(false);
    });
  });

  describe('without trigger', function() {
    beforeEach(function() {
      $rootScope.isopen = true;
      element = $compile('<li dropdown is-open="isopen"><ul><li>Hello</li></ul></li>')($rootScope);
      $rootScope.$digest();
    });

    it('should be open initially', function() {
      expect(element.hasClass(dropdownConfig.openClass)).toBe(true);
    });

    it('should toggle when `is-open` changes', function() {
      $rootScope.isopen = false;
      $rootScope.$digest();
      expect(element.hasClass(dropdownConfig.openClass)).toBe(false);
    });
  });

  describe('`is-open`', function() {
    beforeEach(function() {
      $rootScope.isopen = true;
      element = $compile('<li dropdown is-open="isopen"><a href dropdown-toggle></a><ul><li>Hello</li></ul></li>')($rootScope);
      $rootScope.$digest();
    });

    it('should be open initially', function() {
      expect(element.hasClass(dropdownConfig.openClass)).toBe(true);
    });

    it('should change `is-open` binding when toggles', function() {
      clickDropdownToggle();
      expect($rootScope.isopen).toBe(false);
    });

    it('should toggle when `is-open` changes', function() {
      $rootScope.isopen = false;
      $rootScope.$digest();
      expect(element.hasClass(dropdownConfig.openClass)).toBe(false);
    });

    it('focus toggle element when opening', function() {
      $document.find('body').append(element);
      clickDropdownToggle();
      $rootScope.isopen = false;
      $rootScope.$digest();
      expect(isFocused(element.find('a'))).toBe(false);
      $rootScope.isopen = true;
      $rootScope.$digest();
      expect(isFocused(element.find('a'))).toBe(true);
    });
  });

  describe('`on-toggle`', function() {
    beforeEach(function() {
      $rootScope.toggleHandler = jasmine.createSpy('toggleHandler');
      $rootScope.isopen = false;
      element = $compile('<li dropdown on-toggle="toggleHandler(open)"  is-open="isopen"><a dropdown-toggle></a><ul><li>Hello</li></ul></li>')($rootScope);
      $rootScope.$digest();
    });

    it('should not have been called initially', function() {
      expect($rootScope.toggleHandler).not.toHaveBeenCalled();
    });

    it('should call it correctly when toggles', function() {
      $rootScope.isopen = true;
      $rootScope.$digest();
      $browser.defer.flush();
      expect($rootScope.toggleHandler).toHaveBeenCalledWith(true);

      clickDropdownToggle();
      $browser.defer.flush();
      expect($rootScope.toggleHandler).toHaveBeenCalledWith(false);
    });
  });

  describe('`on-toggle` with initially open', function() {
    beforeEach(function() {
      $rootScope.toggleHandler = jasmine.createSpy('toggleHandler');
      $rootScope.isopen = true;
      element = $compile('<li dropdown on-toggle="toggleHandler(open)" is-open="isopen"><a dropdown-toggle></a><ul><li>Hello</li></ul></li>')($rootScope);
      $rootScope.$digest();
    });

    it('should not have been called initially', function() {
      $browser.defer.flush();
      expect($rootScope.toggleHandler).not.toHaveBeenCalled();
    });

    it('should call it correctly when toggles', function() {
      $rootScope.isopen = false;
      $rootScope.$digest();
      $browser.defer.flush();
      expect($rootScope.toggleHandler).toHaveBeenCalledWith(false);

      $rootScope.isopen = true;
      $rootScope.$digest();
      $browser.defer.flush();
      expect($rootScope.toggleHandler).toHaveBeenCalledWith(true);
    });
  });

  describe('`on-toggle` without is-open', function() {
    beforeEach(function() {
      $rootScope.toggleHandler = jasmine.createSpy('toggleHandler');
      element = $compile('<li dropdown on-toggle="toggleHandler(open)"><a dropdown-toggle></a><ul><li>Hello</li></ul></li>')($rootScope);
      $rootScope.$digest();
    });

    it('should not have been called initially', function() {
      $browser.defer.flush();
      expect($rootScope.toggleHandler).not.toHaveBeenCalled();
    });

    it('should call it when clicked', function() {
      clickDropdownToggle();
      $browser.defer.flush();
      expect($rootScope.toggleHandler).toHaveBeenCalledWith(true);

      clickDropdownToggle();
      $browser.defer.flush();
      expect($rootScope.toggleHandler).toHaveBeenCalledWith(false);
    });
  });

  describe('`auto-close` option', function() {
    function dropdown(autoClose) {
      return $compile('<li dropdown ' +
        (autoClose === void 0 ? '' : 'auto-close="'+autoClose+'"') +
        '><a href dropdown-toggle></a><ul><li><a href>Hello</a></li></ul></li>')($rootScope);
    }

    it('should close on document click if no auto-close is specified', function() {
      element = dropdown();
      clickDropdownToggle();
      expect(element.hasClass(dropdownConfig.openClass)).toBe(true);
      $document.click();
      expect(element.hasClass(dropdownConfig.openClass)).toBe(false);
    });

    it('should close on document click if empty auto-close is specified', function() {
      element = dropdown('');
      clickDropdownToggle();
      expect(element.hasClass(dropdownConfig.openClass)).toBe(true);
      $document.click();
      expect(element.hasClass(dropdownConfig.openClass)).toBe(false);
    });

    it('auto-close="disabled"', function() {
      element = dropdown('disabled');
      clickDropdownToggle();
      expect(element.hasClass(dropdownConfig.openClass)).toBe(true);
      $document.click();
      expect(element.hasClass(dropdownConfig.openClass)).toBe(true);
    });

    describe('outsideClick', function() {
      it('should close only on a click outside of the dropdown menu', function() {
        element = dropdown('outsideClick');
        clickDropdownToggle();
        expect(element.hasClass(dropdownConfig.openClass)).toBe(true);
        element.find('ul li a').click();
        expect(element.hasClass(dropdownConfig.openClass)).toBe(true);
        $document.click();
        expect(element.hasClass(dropdownConfig.openClass)).toBe(false);
      });

      it('should work with dropdown-append-to-body', function() {
        element = $compile('<li dropdown dropdown-append-to-body auto-close="outsideClick"><a href dropdown-toggle></a><ul class="dropdown-menu" id="dropdown-menu"><li><a href>Hello On Body</a></li></ul></li>')($rootScope);
        clickDropdownToggle();
        expect(element.hasClass(dropdownConfig.openClass)).toBe(true);
        $document.find('#dropdown-menu').find('li').eq(0).trigger('click');
        expect(element.hasClass(dropdownConfig.openClass)).toBe(true);
        $document.click();
        expect(element.hasClass(dropdownConfig.openClass)).toBe(false);
      });
    });

    it('control with is-open', function() {
      $rootScope.isopen = true;
      element = $compile('<li dropdown is-open="isopen" auto-close="disabled"><a href dropdown-toggle></a><ul><li>Hello</li></ul></li>')($rootScope);
      $rootScope.$digest();

      expect(element.hasClass(dropdownConfig.openClass)).toBe(true);
      //should remain open
      $document.click();
      expect(element.hasClass(dropdownConfig.openClass)).toBe(true);
      //now should close
      $rootScope.isopen = false;
      $rootScope.$digest();
      expect(element.hasClass(dropdownConfig.openClass)).toBe(false);
    });

    it('should close anyway if toggle is clicked', function() {
      element = dropdown('disabled');
      clickDropdownToggle();
      expect(element.hasClass(dropdownConfig.openClass)).toBe(true);
      clickDropdownToggle();
      expect(element.hasClass(dropdownConfig.openClass)).toBe(false);
    });

    it('should close anyway if esc is pressed', function() {
      element = dropdown('disabled');
      $document.find('body').append(element);
      clickDropdownToggle();
      triggerKeyDown($document, 27);
      expect(element.hasClass(dropdownConfig.openClass)).toBe(false);
      expect(isFocused(element.find('a'))).toBe(true);
    });

    it('should close anyway if another dropdown is opened', function() {
      var elm1 = dropdown('disabled');
      var elm2 = dropdown();
      expect(elm1.hasClass(dropdownConfig.openClass)).toBe(false);
      expect(elm2.hasClass(dropdownConfig.openClass)).toBe(false);
      clickDropdownToggle(elm1);
      expect(elm1.hasClass(dropdownConfig.openClass)).toBe(true);
      expect(elm2.hasClass(dropdownConfig.openClass)).toBe(false);
      clickDropdownToggle(elm2);
      expect(elm1.hasClass(dropdownConfig.openClass)).toBe(false);
      expect(elm2.hasClass(dropdownConfig.openClass)).toBe(true);
    });

    it('should not close on $locationChangeSuccess if auto-close="disabled"', function () {
      var elm1 = dropdown('disabled');
      expect(elm1.hasClass(dropdownConfig.openClass)).toBe(false);
      clickDropdownToggle(elm1);
      expect(elm1.hasClass(dropdownConfig.openClass)).toBe(true);
      $rootScope.$broadcast('$locationChangeSuccess');
      $rootScope.$digest();
      expect(elm1.hasClass(dropdownConfig.openClass)).toBe(true);
    });
  });

  describe('`keyboard-nav` option', function() {
    function dropdown() {
      return $compile('<li dropdown keyboard-nav><a href dropdown-toggle></a><ul><li><a href>Hello</a></li><li><a href>Hello Again</a></li></ul></li>')($rootScope);
    }
    beforeEach(function() {
      element = dropdown();
    });

    it('should focus first list element when down arrow pressed', function() {
      $document.find('body').append(element);
      clickDropdownToggle();
      triggerKeyDown($document, 40);

      expect(element.hasClass(dropdownConfig.openClass)).toBe(true);
      var optionEl = element.find('ul').eq(0).find('a').eq(0);
      expect(isFocused(optionEl)).toBe(true);
    });

    it('should not focus first list element when down arrow pressed if closed', function() {
      $document.find('body').append(element);
      triggerKeyDown($document, 40);

      expect(element.hasClass(dropdownConfig.openClass)).toBe(false);
      var focusEl = element.find('ul').eq(0).find('a').eq(0);
      expect(isFocused(focusEl)).toBe(false);
    });

    it('should focus second list element when down arrow pressed twice', function() {
      $document.find('body').append(element);
      clickDropdownToggle();
      triggerKeyDown($document, 40);
      triggerKeyDown($document, 40);

      expect(element.hasClass(dropdownConfig.openClass)).toBe(true);
      var focusEl = element.find('ul').eq(0).find('a').eq(1);
      expect(isFocused(focusEl)).toBe(true);
    });
  });

  describe('`keyboard-nav` option', function() {
    function dropdown() {
      return $compile('<li dropdown keyboard-nav><a href dropdown-toggle></a><ul><li><a href>Hello</a></li><li><a href>Hello Again</a></li></ul></li>')($rootScope);
    }
    beforeEach(function() {
      element = dropdown();
    });

    it('should focus first list element when down arrow pressed', function() {
      $document.find('body').append(element);
      clickDropdownToggle();
      triggerKeyDown($document, 40);

      expect(element.hasClass(dropdownConfig.openClass)).toBe(true);
      var focusEl = element.find('ul').eq(0).find('a').eq(0);
      expect(isFocused(focusEl)).toBe(true);
    });

    it('should not focus first list element when up arrow pressed after dropdown toggled', function() {
      $document.find('body').append(element);
      clickDropdownToggle();
      expect(element.hasClass(dropdownConfig.openClass)).toBe(true);

      triggerKeyDown($document, 38);
      var focusEl = element.find('ul').eq(0).find('a').eq(0);
      expect(isFocused(focusEl)).toBe(false);
    });

    it('should not focus any list element when down arrow pressed if closed', function() {
      $document.find('body').append(element);
      triggerKeyDown($document, 40);

      expect(element.hasClass(dropdownConfig.openClass)).toBe(false);
      var focusEl = element.find('ul').eq(0).find('a');
      expect(isFocused(focusEl[0])).toBe(false);
      expect(isFocused(focusEl[1])).toBe(false);
    });

    it('should not change focus when other keys are pressed', function() {
      $document.find('body').append(element);
      clickDropdownToggle();
      triggerKeyDown($document, 37);

      expect(element.hasClass(dropdownConfig.openClass)).toBe(true);
      var focusEl = element.find('ul').eq(0).find('a');
      expect(isFocused(focusEl[0])).toBe(false);
      expect(isFocused(focusEl[1])).toBe(false);
    });

    it('should focus second list element when down arrow pressed twice', function() {
      $document.find('body').append(element);
      clickDropdownToggle();
      triggerKeyDown($document, 40);
      triggerKeyDown($document, 40);

      expect(element.hasClass(dropdownConfig.openClass)).toBe(true);
      var focusEl = element.find('ul').eq(0).find('a').eq(1);
      expect(isFocused(focusEl)).toBe(true);
    });

    it('should focus first list element when down arrow pressed 2x and up pressed 1x', function() {
      $document.find('body').append(element);
      clickDropdownToggle();
      triggerKeyDown($document, 40);
      triggerKeyDown($document, 40);

      triggerKeyDown($document, 38);

      expect(element.hasClass(dropdownConfig.openClass)).toBe(true);
      var focusEl = element.find('ul').eq(0).find('a').eq(0);
      expect(isFocused(focusEl)).toBe(true);
    });

    it('should stay focused on final list element if down pressed at list end', function() {
      $document.find('body').append(element);
      clickDropdownToggle();
      triggerKeyDown($document, 40);
      triggerKeyDown($document, 40);

      expect(element.hasClass(dropdownConfig.openClass)).toBe(true);
      var focusEl = element.find('ul').eq(0).find('a').eq(1);
      expect(isFocused(focusEl)).toBe(true);

      triggerKeyDown($document, 40);
      expect(isFocused(focusEl)).toBe(true);
    });

    it('should close if esc is pressed while focused', function() {
      element = dropdown('disabled');
      $document.find('body').append(element);
      clickDropdownToggle();

      triggerKeyDown($document, 40);

      expect(element.hasClass(dropdownConfig.openClass)).toBe(true);
      var focusEl = element.find('ul').eq(0).find('a').eq(0);
      expect(isFocused(focusEl)).toBe(true);

      triggerKeyDown($document, 27);
      expect(element.hasClass(dropdownConfig.openClass)).toBe(false);
    });
  });

  describe('`keyboard-nav` option with `dropdown-append-to-body` option', function() {
    function dropdown() {
      return $compile('<li dropdown dropdown-append-to-body keyboard-nav><a href dropdown-toggle></a><ul class="dropdown-menu" id="dropdown-menu"><li><a href>Hello On Body</a></li><li><a href>Hello Again</a></li></ul></li>')($rootScope);
    }

    beforeEach(function() {
      element = dropdown();
    });

    it('should focus first list element when down arrow pressed', function() {
      clickDropdownToggle();

      triggerKeyDown($document, 40);

      expect(element.hasClass(dropdownConfig.openClass)).toBe(true);
      var focusEl = $document.find('ul').eq(0).find('a');
      expect(isFocused(focusEl)).toBe(true);
    });

    it('should not focus first list element when down arrow pressed if closed', function() {
      triggerKeyDown($document, 40);

      expect(element.hasClass(dropdownConfig.openClass)).toBe(false);
      var focusEl = $document.find('ul').eq(0).find('a');
      expect(isFocused(focusEl)).toBe(false);
    });

    it('should focus second list element when down arrow pressed twice', function() {
      clickDropdownToggle();
      triggerKeyDown($document, 40);
      triggerKeyDown($document, 40);

      expect(element.hasClass(dropdownConfig.openClass)).toBe(true);
      var elem1 = $document.find('ul');
      var elem2 = elem1.find('a');
      var focusEl = $document.find('ul').eq(0).find('a').eq(1);
      expect(isFocused(focusEl)).toBe(true);
    });
  });
});
