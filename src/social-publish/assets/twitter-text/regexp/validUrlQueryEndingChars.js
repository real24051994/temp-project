// Copyright 2018 Twitter, Inc.
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0


import regexSupplant from '../lib/regexSupplant';
const validUrlQueryEndingChars = /[a-z0-9\-_&=#\/]/i;
const reg = regexSupplant(
	/[a-z0-9\-_&=#\/]/i,
  );
export default reg;
